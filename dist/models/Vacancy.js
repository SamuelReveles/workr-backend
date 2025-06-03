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
const connection_1 = require("../database/connection");
const ParameterizedQuery_1 = __importDefault(require("../database/ParameterizedQuery"));
const queryGenerators_1 = require("../database/queryGenerators");
const datetime_1 = require("../helpers/datetime");
const uuid_1 = require("../helpers/uuid");
class Vacancy {
    /**
     * Registra una nueva vacante en la BD con los datos indicados en solicitud.
     * @param body Cuerpo de la solicitud con los datos de la nueva vacante.
     * @param companyId Id de la empresa que publica la vacante.
     */
    static postVacancy(body, companyId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Configuración del nuevo registro de vacante.
            const vacancyId = (0, uuid_1.generateUUID)();
            const newVacancy = {
                id: vacancyId,
                position: body.position,
                office_address: body.officeAddress,
                work_modality: body.workModality,
                work_days: body.workDays,
                daily_schedule: body.dailySchedule,
                description: body.description,
                creation_date: (0, datetime_1.getDateString)(),
                accepts_applications: true,
                company_id: companyId,
            };
            const transactionQueries = [];
            // Se agrega la query que crea el registro base de la vacante a
            // las queries de la transacción a realizar para la publicación completa.
            transactionQueries.push(new ParameterizedQuery_1.default("INSERT INTO Vacancies SET ?", [newVacancy]));
            // Se agrega una query generada para insertar todas las skills asociadas
            // a la vacante.
            const vacancySkillsInsertionQuery = (0, queryGenerators_1.generateReferenceRecordsInsertionQuery)(body.skills, "Vacancy_skills", vacancyId, skill => [skill]);
            if (vacancySkillsInsertionQuery != null) {
                transactionQueries.push(vacancySkillsInsertionQuery);
            }
            // Se ejecuta la transacción completa de cambios.
            yield (0, connection_1.executeTransaction)(transactionQueries);
        });
    }
    /**
     * Devuelve un resumen de información de las vacantes de la empresa referenciada.
     * @param companyId Id de la empresa cuyas vacantes se consultarán.
     * @returns Un arreglo conteniendo información de resumen del listado de
     * vacantes de la empresa.
     */
    static getCompanyVacancies(companyId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Obtención de registros de vacantes de la empresa.
            const vacancyResults = yield (0, connection_1.executeQuery)("SELECT id, position, office_address, creation_date FROM Vacancies WHERE company_id = ?", [companyId]);
            // Por cada registro de vacante se crea un objeto a incluir en 
            // un array que tenga los datos de interés para el listado de
            // vacantes de la empresa.
            const vacancyData = [];
            for (const result of vacancyResults) {
                vacancyData.push({
                    id: result["id"],
                    position: result["position"],
                    location: result["office_address"],
                    daysAgo: (0, datetime_1.calculateDaysFrom)(result["creation_date"]),
                });
            }
            // Se devuelve el array.
            return vacancyData;
        });
    }
    /**
     * Busca las vacantes que coincidan con los filtros proporcionados, en el orden
     * deseado.
     * @param body Conjunto de parámetros para la búsqueda.
     * @returns Array con los resultados de la búsqueda.
     */
    static searchVacancies(body) {
        return __awaiter(this, void 0, void 0, function* () {
            // Se ajustan los parámetros de la query dependiendo de los datos provistos
            // en la request.
            const positionFilter = body.position != "" ? `%${body.position}%` : "%";
            const locationFilter = body.location != "" ? `%${body.location}%` : "%";
            const companyFilter = body.company != "" ? `%${body.company}%` : "%";
            const orderColumn = body.orderBy;
            const orderDirection = body.orderDirection;
            // Se realiza la consulta.
            const results = yield (0, connection_1.executeQuery)("SELECT Vacancies.id AS id, position, office_address, Vacancies.creation_date AS creation_date, Companies.name AS company " +
                "FROM Vacancies INNER JOIN Companies ON Vacancies.company_id = Companies.id " +
                "WHERE Vacancies.accepts_applications = 1 AND " +
                "position LIKE ? AND " +
                "office_address LIKE ? AND " +
                "Companies.name LIKE ? " +
                `ORDER BY ${orderColumn} ${orderDirection}`, [positionFilter, locationFilter, companyFilter]);
            // Se devuelven los resultados como un arreglo de objetos.
            return results.map(row => {
                return {
                    id: row["id"],
                    position: row["position"],
                    company: row["company"],
                    location: row["office_address"],
                    daysAgo: (0, datetime_1.calculateDaysFrom)(row["creation_date"]),
                };
            });
        });
    }
    /**
     * Obtiene los detalles de la vacante indicada si existe.
     * @param vacancyId Id de la vacante cuyos detalles se obtendrán.
     * @returns Objeto con los detalles de la vacante referenciada si
     * se encuentra, o nulo de otro modo.
     */
    static getVacancyDetails(vacancyId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Se obtiene información básica de la vacante.
            const vacancyResults = yield (0, connection_1.executeQuery)("SELECT * FROM Vacancies WHERE id = ?", [vacancyId]);
            // Si no se encontró coincidencia de la vacante se devuelve nulo.
            if (vacancyResults.length == 0) {
                return null;
            }
            // Si se encontró la vacante se obtiene su fila de resultados.
            const vacancyRow = vacancyResults[0];
            // Se obtiene información de la empresa y habilidades asociadas
            // con la vacante.
            const companyRow = (yield (0, connection_1.executeQuery)("SELECT profile_picture, name FROM Companies WHERE id = ?", [vacancyRow["company_id"]]))[0];
            const skillResults = yield (0, connection_1.executeQuery)("SELECT skill_name FROM Vacancy_skills WHERE vacancy_id = ?", [vacancyId]);
            // Se devuelve un objeto con toda la información de la vacante.
            return {
                vacancyId: vacancyId,
                position: vacancyRow["position"],
                companyId: vacancyRow["company_id"],
                companyProfilePicture: companyRow["profile_picture"],
                companyName: companyRow["name"],
                postDate: vacancyRow["creation_date"].toISOString().substring(0, 10),
                location: vacancyRow["office_address"],
                workModality: vacancyRow["work_modality"],
                description: vacancyRow["description"],
                skills: skillResults.map(row => row["skill_name"]),
                workDays: vacancyRow["work_days"],
                dailySchedule: vacancyRow["daily_schedule"],
            };
        });
    }
    /**
     * Cierra una vacante para que ya no aparezca en resultados de búsqueda y no pueda
     * recibir nuevas solicitudes de aspirantes.
     * @param vacancyId Id de la vacante a cerrar.
     * @returns True si la vacante se cerró correctamente, o null si no se encontró.
     */
    static closeVacancy(vacancyId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Se busca la vacante en la BD para saber si existe.
            const vacancyResults = yield (0, connection_1.executeQuery)("SELECT position FROM Vacancies WHERE id = ?", [vacancyId]);
            // Si no se encuentra la vacante en la BD significa que
            // no existe, por tanto se devuelve null.
            if (vacancyResults.length == 0) {
                return null;
            }
            // Se actualiza la vacante para que ya no esté disponible a solicitudes.
            yield (0, connection_1.executeQuery)("UPDATE Vacancies SET accepts_applications = 0 WHERE id = ?", [vacancyId]);
            // Devolver true indica que la vacante se cerró correctamente.
            return true;
        });
    }
}
exports.default = Vacancy;
//# sourceMappingURL=Vacancy.js.map