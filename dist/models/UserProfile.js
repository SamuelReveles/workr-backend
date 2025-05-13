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
const datetime_1 = require("../helpers/datetime");
const profilePictures_1 = require("../helpers/profilePictures");
const queryGenerators_1 = require("../database/queryGenerators");
class UserProfile {
    /**
     * Actualiza los datos mostrados en el perfil de un usuario referenciado por su id,
     * guardando una nueva foto de perfil provista y tomando los nuevos datos para
     * los campos provistos en body.
     * @param userId Id del usuario cuyo perfil se actualizará.
     * @param profilePictureFile Nueva foto de perfil para el usuario.
     * @param body Conjunto de datos de perfil del usuario.
     */
    static updateProfile(userId, profilePictureFile, body) {
        return __awaiter(this, void 0, void 0, function* () {
            // Se recupera el id de imagen de perfil previa del usuario para su referencia.
            const oldProfilePictureId = (yield (0, connection_1.executeQuery)("SELECT profile_picture FROM Users WHERE id = ?", [userId]))[0]["profile_picture"];
            // Se guarda la nueva foto de perfil en almacenamiento y se recupera su id de referencia.
            const newProfilePictureId = yield (0, profilePictures_1.saveNewProfilePicture)(profilePictureFile, this.profilePicturesDirectory);
            // Se generan todas las queries que actualizan los datos del perfil de usuario
            // con el id, la referencia de foto de perfil y los argumentos provistos en body.
            const updateTransactionQueries = this.generateUpdateTransactionQueries(userId, newProfilePictureId, body);
            // Transacción principal de cambios.
            try {
                yield (0, connection_1.executeTransaction)(updateTransactionQueries);
                // Si la transacción se completa correctamente, se borrará la
                // imagen de perfil previa (si existía).
                if (oldProfilePictureId !== "") {
                    (0, profilePictures_1.deleteProfilePictureFile)(oldProfilePictureId, this.profilePicturesDirectory);
                }
            }
            // Si ocurren errores en la transacción, se borrará la nueva imagen subida.
            catch (e) {
                (0, profilePictures_1.deleteProfilePictureFile)(newProfilePictureId, this.profilePicturesDirectory);
                throw e;
            }
        });
    }
    /**
     * Obtiene la información de perfil del usuario referenciado.
     * @param userId Id del usuario cuyo perfil se obtendrá.
     * @returns Conjunto de información de perfil si existe, null de otro modo.
     */
    static getProfile(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Información que presenta al usuario brevemente.
            const presentationData = yield this.queryProfilePresentationData(userId);
            // Si no se obtiene la información de presentación básica del usuario
            // significa que el perfil completo no existe.
            if (presentationData == null) {
                return null;
            }
            // Se obtiene información de las siguientes secciones del perfil.
            const contactLinks = yield this.queryProfileRecords(userId, "User_contact_links");
            const experience = this.formatRecordsDates(yield this.queryProfileRecords(userId, "Experience_records"));
            const skills = (yield this.queryProfileRecords(userId, "User_skills")).map(row => row["skill_name"]);
            const education = this.formatRecordsDates(yield this.queryProfileRecords(userId, "Education_records"));
            // Se devuelve un objeto que contiene toda la información del perfil.
            return { presentationData, contactLinks, experience, skills, education };
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
     * Crea todas las queries necesarias para actualizar la BD con la nueva información
     * de perfil de un usuario.
     * @param userId Id del usuario cuyo perfil se actualizará.
     * @param newProfilePictureId Id de la nueva foto de perfil del usuario.
     * @param body Conjunto de datos actualizados del perfil del usuario.
     * @returns
     */
    static generateUpdateTransactionQueries(userId, newProfilePictureId, body) {
        const parameterizedQueries = [];
        // Query para datos directos de usuario.
        parameterizedQueries.push(new ParameterizedQuery_1.default("UPDATE Users SET profile_picture = ?, description = ?, last_update_date = ? WHERE id = ?", [newProfilePictureId, body.description, (0, datetime_1.getDateString)(), userId]));
        // Queries para enlaces de contacto.
        parameterizedQueries.push((0, queryGenerators_1.generateReferenceRecordsDeletionQuery)("User_contact_links", "user_id", userId));
        parameterizedQueries.push((0, queryGenerators_1.generateReferenceRecordsInsertionQuery)(body.contactLinks, "User_contact_links", userId, (r) => [r.platform, r.link]));
        // Queries para registros de experiencia.
        parameterizedQueries.push((0, queryGenerators_1.generateReferenceRecordsDeletionQuery)("Experience_records", "user_id", userId));
        parameterizedQueries.push((0, queryGenerators_1.generateReferenceRecordsInsertionQuery)(body.experience, "Experience_records", userId, (r) => [r.position, r.company, r.startDate, r.endDate, r.description]));
        // Queries para habilidades.
        parameterizedQueries.push((0, queryGenerators_1.generateReferenceRecordsDeletionQuery)("User_skills", "user_id", userId));
        parameterizedQueries.push((0, queryGenerators_1.generateReferenceRecordsInsertionQuery)(body.skills, "User_skills", userId, (r) => [r]));
        // Queries para registros de educación.
        parameterizedQueries.push((0, queryGenerators_1.generateReferenceRecordsDeletionQuery)("Education_records", "user_id", userId));
        parameterizedQueries.push((0, queryGenerators_1.generateReferenceRecordsInsertionQuery)(body.education, "Education_records", userId, (r) => [r.title, r.organization, r.startDate, r.endDate, r.description]));
        return parameterizedQueries;
    }
    /**
     * Función auxiliar que obtiene la información que presenta al usuario brevemente.
     * @param userId Id del usuario cuya información se busca.
     * @returns Objeto con pares clave-valor de la información buscada si se encuentra el
     * perfil, null de otro modo.
     */
    static queryProfilePresentationData(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryResults = yield (0, connection_1.executeQuery)("SELECT profile_picture, full_name, description, country FROM Users WHERE id = ?", [userId]);
            if (queryResults.length == 0) {
                return null;
            }
            const dataRow = queryResults[0];
            return {
                profilePicture: dataRow["profile_picture"],
                fullName: dataRow["full_name"],
                description: dataRow["description"],
                country: dataRow["country"]
            };
        });
    }
    /**
     * Función auxiliar que obtiene los registros de información que describen
     * una sección del perfil.
     * @param userId Id del usuario cuya información se busca.
     * @param profileSection Sección del perfil a la que pertenecen los datos.
     * @returns
     */
    static queryProfileRecords(userId, profileSection) {
        return __awaiter(this, void 0, void 0, function* () {
            let query = `SELECT * FROM ${profileSection} WHERE user_id = ?`;
            const params = [userId];
            const queryResults = yield (0, connection_1.executeQuery)(query, params);
            // Se devuelven los registros después de quitarles información de identificadores.
            return queryResults.map(resultRow => {
                delete resultRow["id"];
                delete resultRow["user_id"];
                return resultRow;
            });
        });
    }
    /**
     * Función auxiliar para formatear la información de fechas al formato ISO-8601.
     * @param records Registros donde se formatearán las fechas.
     * @returns Registros con las fechas ya formateadas.
     */
    static formatRecordsDates(records) {
        const dateSubstringLength = "AAAA-MM-DD".length;
        return records.map(row => {
            row["startDate"] = row["start_date"].toISOString().substring(0, dateSubstringLength);
            row["endDate"] = row["end_date"].toISOString().substring(0, dateSubstringLength);
            delete row["start_date"];
            delete row["end_date"];
            return row;
        });
    }
}
UserProfile.profilePicturesDirectory = `${__dirname}/../file_uploads/user_pfp`;
exports.default = UserProfile;
//# sourceMappingURL=UserProfile.js.map