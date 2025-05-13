"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const profilePictures_1 = require("../helpers/profilePictures");
const connection_1 = require("../database/connection");
const uuid_1 = require("../helpers/uuid");
const encryption_1 = require("../helpers/encryption");
const datetime_1 = require("../helpers/datetime");
const ParameterizedQuery_1 = __importDefault(require("../database/ParameterizedQuery"));
const queryGenerators_1 = require("../database/queryGenerators");
const charts_1 = require("../helpers/charts");
class Company {
    /**
     * Registra una nueva empresa tomando los datos de la solicitud.
     * @param profilePictureFile Archivo con la foto de perfil de la empresa.
     * @param body Conjunto de datos de creación de la empresa.
     */
    static register(profilePictureFile, body) {
        return __awaiter(this, void 0, void 0, function* () {
            // Se guarda la nueva foto de perfil en almacenamiento y se recupera su id para referencia.
            const profilePictureId = yield (0, profilePictures_1.saveNewProfilePicture)(profilePictureFile, this.profilePicturesDirectory);
            // Se define el nuevo registro a insertar en la BD.
            const newCompanyData = {
                id: (0, uuid_1.generateUUID)(),
                name: body.name,
                admin_email: body.adminEmail,
                hashed_admin_password: (0, encryption_1.hashPassword)(body.adminPassword),
                profile_picture: profilePictureId,
                type: body.type,
                commercial_sector: body.commercialSector,
                employee_count: body.employeeCount,
                creation_date: (0, datetime_1.getDateString)(),
                last_update_date: (0, datetime_1.getDateString)(),
            };
            // Se registra la empresa en la BD con su información definida.
            yield (0, connection_1.executeQuery)("INSERT INTO Companies SET ?", newCompanyData);
        });
    }
    /**
     * Actualiza la información del perfil de una empresa tomando los datos
     * recibidos en la solicitud.
     * @param companyId Id de la empresa cuyo perfil se actualizará.
     * @param profilePictureFile Archivo con la nueva foto de perfil de la empresa.
     * @param body Conjunto de datos de perfil de la empresa.
     */
    static updateProfile(companyId, profilePictureFile, body) {
        return __awaiter(this, void 0, void 0, function* () {
            // Se obtiene el id de la antigua foto de perfil de la empresa para su referencia.
            const oldProfilePictureId = (yield (0, connection_1.executeQuery)("SELECT profile_picture FROM Companies WHERE id = ?", [companyId]))[0]["profile_picture"];
            // Se guarda la nueva foto de perfil en almacenamiento y se recupera su id de referencia.
            const newProfilePictureId = yield (0, profilePictures_1.saveNewProfilePicture)(profilePictureFile, this.profilePicturesDirectory);
            // Se generan todas las queries para actualizar la información de perfil de la empresa.
            const updateTransactionQueries = this.generateUpdateTransactionQueries(companyId, newProfilePictureId, body);
            // Transacción principal de cambios.
            try {
                yield (0, connection_1.executeTransaction)(updateTransactionQueries);
                // Si la transacción se completa correctamente, se borrará la imagen de perfil previa.
                (0, profilePictures_1.deleteProfilePictureFile)(oldProfilePictureId, this.profilePicturesDirectory);
            }
            // Si ocurren errores en la transacción, se borrará la nueva imagen subida.
            catch (err) {
                (0, profilePictures_1.deleteProfilePictureFile)(newProfilePictureId, this.profilePicturesDirectory);
                throw err;
            }
        });
    }
    /**
     * Obtiene la información de perfil de la empresa referenciada.
     * @param companyId Id de la empresa cuyo perfil se obtendrá.
     * @returns Conjunto de información de perfil si existe, null de otro modo.
     */
    static getProfile(companyId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Se busca la principal sección de información de la empresa.
            const mainData = yield this.queryProfileMainData(companyId);
            // Si no se obtiene la información principal de la empresa
            // significa que el perfil completo no existe.
            if (mainData == null) {
                return null;
            }
            // Se obtienen los enlaces de contacto que referencian a la empresa.
            const contactLinks = yield (0, connection_1.executeQuery)("SELECT platform, link FROM Company_contact_links WHERE company_id = ?", [companyId]);
            // Se devuelve un objeto que contiene toda la información del perfil.
            return Object.assign(Object.assign({}, mainData), { contactLinks });
        });
    }
    /**
     * Obtiene la información de las gráficas de la empresa.
     * @param companyId Id de la empresa.
     * @returns Conjunto de información de las gráficas.
     */
    static getVacancyCharts(companyId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [applicationsData, newJobsData] = yield Promise.all([
                // Obtener el historial de solicitudes de la empresa
                (0, connection_1.executeQuery)(`
        SELECT COUNT(ja.id) AS quantity, MONTH(ja.creation_date) AS month, YEAR(ja.creation_date) AS year FROM Job_applications ja 
        INNER JOIN Vacancies v ON v.id = ja.vacancy_id 
        INNER JOIN Companies c ON c.id = v.company_id
        WHERE c.id = ?;
        `, [companyId]),
                // Obtener alta de empleados
                (0, connection_1.executeQuery)(`
          SELECT COUNT(user_id) AS quantity, MONTH(accepted_date) AS month, YEAR(accepted_date) AS year 
          FROM Employees
          WHERE company_id = ?;
        `, [companyId])
            ]);
            const applicationsPoints = applicationsData.map(a => { return { quantity: a.quantity, month: a.month, year: a.year }; });
            const newJobsDataPoints = newJobsData.map(j => { return { quantity: j.quantity, month: j.month, year: j.year }; });
            return { apllications: (0, charts_1.formatChartData)(applicationsPoints), jobs: (0, charts_1.formatChartData)(newJobsDataPoints) };
        });
    }
    /**
     * Resuelve la ruta absoluta a una foto de perfil referenciada si existe.
     * @param id Identificador de la foto cuya ruta se busca.
     * @returns Ruta absoluta para la foto de perfil si existe,
     * null de otro modo.
     */
    static getProfilePicturePath(id) {
        return (0, profilePictures_1.resolveProfilePicturePath)(this.profilePicturesDirectory, id);
    }
    /**
     * Función auxiliar para generar las queries de la transacción SQL de actualización
     * de perfil de la empresa.
     * @param companyId Id de la empresa cuyo perfil se actualizará
     * @param profilePictureId Id de la imagen de perfil de la empresa.
     * @param body Conjunto de datos de perfil de la empresa.
     * @returns Una lista de ParameterizedQueries adecuadas para la actualización deseada.
     */
    static generateUpdateTransactionQueries(companyId, profilePictureId, body) {
        const transactionQueries = [];
        transactionQueries.push(new ParameterizedQuery_1.default("UPDATE Companies SET ? WHERE id = ?", [
            {
                profile_picture: profilePictureId,
                description: body.description,
                mission: body.mission,
                vision: body.vision,
                address: body.address,
                last_update_date: (0, datetime_1.getDateString)(),
            },
            companyId,
        ]));
        transactionQueries.push((0, queryGenerators_1.generateReferenceRecordsDeletionQuery)("Company_contact_links", "company_id", companyId));
        transactionQueries.push((0, queryGenerators_1.generateReferenceRecordsInsertionQuery)(body.contactLinks, "Company_contact_links", companyId, (r) => [r.platform, r.link]));
        return transactionQueries;
    }
    /**
     * Función auxiliar que obtiene la información principal de la empresa
     * @param companyId Id de la empresa cuya información se busca.
     * @returns Objeto con pares clave-valor de la información buscada si se encuentra el
     * perfil, null de otro modo.
     */
    static queryProfileMainData(companyId) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryResults = yield (0, connection_1.executeQuery)("SELECT name, profile_picture, type, commercial_sector, employee_count, address, " +
                "description, mission, vision FROM Companies WHERE id = ?", [companyId]);
            if (queryResults.length == 0) {
                return null;
            }
            const dataRow = queryResults[0];
            // Renombramiento de datos con identificador snake_case.
            dataRow.profilePicture = dataRow.profile_picture;
            delete dataRow.profile_picture;
            dataRow.commercialSector = dataRow.commercial_sector;
            delete dataRow.commercial_sector;
            dataRow.employeeCount = dataRow.employee_count;
            delete dataRow.employee_count;
            return dataRow;
        });
    }
}
Company.profilePicturesDirectory = `${__dirname}/../file_uploads/company_pfp`;
exports.default = Company;
//# sourceMappingURL=Company.js.map