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
Object.defineProperty(exports, "__esModule", { value: true });
const connection_1 = require("../database/connection");
const datetime_1 = require("../helpers/datetime");
const uuid_1 = require("../helpers/uuid");
class JobApplication {
    /**
     * Registra al usuario autenticado como un aspirante a
     * una vacante usando la información de la solicitud.
     * @param userId Id del usuario autenticado que se registra como aspirante.
     * @param body Cuerpo con los datos de solicitud de empleo a la vacante.
     */
    static register(userId, body) {
        return __awaiter(this, void 0, void 0, function* () {
            // Se conforma el registro de la nueva solicitud de empleo.
            const newJobApplication = {
                id: (0, uuid_1.generateUUID)(),
                contact_email: body.contactEmail,
                phone_number: body.phoneNumber,
                highest_education_level: body.highestEducationLevel,
                experience: body.experience,
                hard_skills: body.hardSkills,
                soft_skills: body.softSkills,
                application_reason: body.applicationReason,
                portfolio_link: body.portfolioLink,
                creation_date: (0, datetime_1.getDateString)(),
                vacancy_id: body.vacancyId,
                user_id: userId,
            };
            // Se registra la solicitud de empleo en la BD.
            yield (0, connection_1.executeQuery)("INSERT INTO Job_applications SET ?", [newJobApplication]);
        });
    }
    /**
     * Obtiene la lista de aspirantes a la vacante indicada si existe.
     * @param vacancyId Id de la vacante cuyos aspirantes se obtendrán.
     * @returns Array que contiene información resumida de los aspirantes
     * a la vacante indicada, o null si no se encuentra la vacante.
     */
    static getVacancyApplicants(vacancyId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Verificación para saber si la vacante realmente existe.
            const vacancyResults = yield (0, connection_1.executeQuery)("SELECT position FROM Vacancies WHERE id = ?", [vacancyId]);
            // Si no se encuentran resultados para la vacante significa que no
            // existe, por tanto se devuelve null.
            if (vacancyResults.length == 0) {
                return null;
            }
            // Obtención de datos de aspirantes.
            const aspirantsResults = yield (0, connection_1.executeQuery)("SELECT Job_applications.id AS job_application_id, Users.id AS user_id, " +
                "Users.full_name AS name, Users.profile_picture AS profile_picture " +
                "FROM Job_applications INNER JOIN Users ON Job_applications.user_id = Users.id " +
                "WHERE Job_applications.vacancy_id = ?", [vacancyId]);
            // Se devuelve un array conteniendo la información resumida de aspirantes.
            return aspirantsResults.map(row => {
                return {
                    jobApplicationId: row["job_application_id"],
                    aspirantId: row["user_id"],
                    aspirantName: row["name"],
                    aspirantProfilePicture: row["profile_picture"],
                };
            });
        });
    }
    /**
     * Obtiene las respuestas al formulario de solicitud de empleo
     * para la solicitud de empleo referenciada si es que existe.
     * @param jobApplicationId Id de la solicitud de empleo cuyo formulario
     * se recuperará.
     * @returns Objeto con respuestas al formulario de la solicitud de
     * empleo indicada, o null si no existe.
     */
    static getFormAnswers(jobApplicationId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Se busca la información de la solicitud.
            const applicationResults = yield (0, connection_1.executeQuery)("SELECT * FROM Job_applications WHERE id = ?", [jobApplicationId]);
            // Si no se encuentran resultados para la solicitud referenciada
            // quiere decir que no existe, por tanto se devuelve null.
            if (applicationResults.length == 0) {
                return null;
            }
            // Se devuelven las respuestas al formulario de la solicitud de empleo.
            const applicationRow = applicationResults[0];
            return {
                contactEmail: applicationRow["contact_email"],
                phoneNumber: applicationRow["phone_number"],
                highestEducationLevel: applicationRow["highest_education_level"],
                experience: applicationRow["experience"],
                hardSkills: applicationRow["hard_skills"],
                softSkills: applicationRow["soft_skills"],
                applicationReason: applicationRow["application_reason"],
                portfolioLink: applicationRow["portfolio_link"],
            };
        });
    }
    /**
     * Registra un agendado de entrevista en la base de datos para la
     * solicitud referenciada
     * @param jobApplicationId Id de la solicitud de empleo por la cual se
     * agenda la entrevista.
     * @returns True si se registra la entrevista correctamente, o null
     * si no se encuentra la solicitud referenciada.
     */
    static registerInterview(jobApplicationId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Se busca información de la solicitud de empleo referenciada.
            const jobApplicationResults = yield (0, connection_1.executeQuery)("SELECT creation_date FROM Job_applications WHERE id = ?", [jobApplicationId]);
            // Si no se encuentran resultados para la solicitud de empleo
            // significa que no existe, por tanto se devuelve null.
            if (jobApplicationResults.length == 0) {
                return null;
            }
            // Se define la información de un nuevo registro de notas de entrevista.
            const newJobInterviewNotes = {
                id: (0, uuid_1.generateUUID)(),
                interview_notes: "",
                job_application_id: jobApplicationId,
            };
            // Se registra una nueva entrada de notas de entrevista de empleo
            // asociadas a la solicitud referenciada, de esa manera se sabe
            // que la entrevista fue agendada.
            yield (0, connection_1.executeQuery)("INSERT INTO Job_interview_notes SET ?", [newJobInterviewNotes]);
            return true;
        });
    }
    /**
     * Devuelve un listado con información resumida de los aspirantes
     * contactados por una entrevista agendada para la vacante referenciada,
     * si existe.
     * @param vacancyId Id de la vacante cuyos aspirantes contactados se consultarán.
     * @returns Un array con el listado de aspirantes contactados para la vacante,
     * o null si la vacante no existe.
     */
    static getContactedVacancyApplicants(vacancyId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Se busca información sobre la vacante referenciada.
            const vacancyResults = yield (0, connection_1.executeQuery)("SELECT creation_date FROM Vacancies WHERE id = ?", [vacancyId]);
            // Si no hay resultados para la vacante referenciada significa
            // que no existe, por tanto se devuelve null.
            if (vacancyResults.length == 0) {
                return null;
            }
            // Se obtiene información resumida de los usuarios que solicitaron empleo
            // para la vacante dada y que fueron contactados para una entrevista.
            const contactedApplicantsResults = yield (0, connection_1.executeQuery)("SELECT U.id AS user_id, U.full_name AS user_name, U.profile_picture AS user_profile_picture, " +
                "A.id AS job_application_id, N.id AS interview_notes_id " +
                "FROM Users AS U INNER JOIN Job_applications AS A ON U.id = A.user_id " +
                "INNER JOIN Job_interview_notes AS N ON A.id = N.job_application_id " +
                "WHERE A.vacancy_id = ?", [vacancyId]);
            // Se devuelve el listado con información resumida de los aspirantes contactados.
            return contactedApplicantsResults.map(row => {
                return {
                    applicantId: row["user_id"],
                    applicantName: row["user_name"],
                    applicantProfilePicture: row["user_profile_picture"],
                    jobApplicationId: row["job_application_id"],
                    interviewNotesId: row["interview_notes_id"],
                };
            });
        });
    }
    /**
     * Obtiene las notas de entrevista con el id referenciado si existen.
     * @param interviewNotesId Id de las notas de entrevista a recuperar de la BD.
     * @returns Un objeto que contiene las notas de entrevista si se encuentran,
     * o null si no se encuentran las notas referenciadas.
     */
    static getInterviewNotes(interviewNotesId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Se buscan las notas en la BD.
            const notesResults = yield (0, connection_1.executeQuery)("SELECT interview_notes FROM Job_interview_notes WHERE id = ?", [interviewNotesId]);
            // Si no se encuentran resultados para la id referenciada de notas
            // significa que no existen, por lo tanto se devuelve null.
            if (notesResults.length == 0) {
                return null;
            }
            // Si se encuentran las notas se devuelven en un objeto.
            else {
                return {
                    interviewNotes: notesResults[0]["interview_notes"],
                };
            }
        });
    }
    /**
     * Actualiza las notas guardadas en la BD de una entrevista referenciada.
     * @param interviewNotesId Id de las notas que se actualizarán.
     * @param interviewNotes Nuevo contenido de las notas a registrar.
     * @returns True si las notas se actualizan correctamente,
     * o null si no se encuentra el registro de las notas referenciadas.
     */
    static updateInterviewNotes(interviewNotesId, interviewNotes) {
        return __awaiter(this, void 0, void 0, function* () {
            // Se busca información sobre el registro de las notas.
            const notesResults = yield (0, connection_1.executeQuery)("SELECT interview_notes FROM Job_interview_notes WHERE id = ?", [interviewNotesId]);
            // Si no se encuentra el registro de las notas referenciadas
            // significa que no existen, por tanto se devuelve null.
            if (notesResults.length == 0) {
                return null;
            }
            // Se actualiza el registro de notas encontrado con el id.
            yield (0, connection_1.executeQuery)("UPDATE Job_interview_notes SET interview_notes = ? WHERE id = ?", [interviewNotes, interviewNotesId]);
            return true;
        });
    }
    /**
     * Agrega una serie de empleados recién contratados a la BD.
     * @param newHiresIds Arreglo con los id de usuario de los aspirantes contratados.
     * @param companyId Id de la empresa que contrata.
     * @returns Un arreglo que contiene cualquier posible usuario no encontrado,
     * si es que alguno no se encontró, o un arreglo vacío en caso de que todos los
     * contratados se hayan registrado.
     */
    static registerNewHires(newHiresIds, companyId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Se busca información con todos los ids de aspirantes recién contratados.
            const usersResults = yield (0, connection_1.executeQuery)("SELECT id FROM Users WHERE id IN (?)", [newHiresIds]);
            // Cada resultado obtenido se agrega a un mapa con los ids validados.
            const usersMap = usersResults.reduce((map, row) => {
                map[row["id"]] = true;
                return map;
            }, {});
            // Se busca si un id corresponde a un usuario que ya haya sido
            // contratado por otra empresa y se agregan los resultados a un mapa.
            const hiredUsersResults = yield (0, connection_1.executeQuery)("SELECT user_id FROM Employees WHERE user_id IN (?) AND is_active = TRUE", [newHiresIds]);
            const hiredUsersMap = hiredUsersResults.reduce((map, row) => {
                map[row["user_id"]] = true;
                return map;
            }, {});
            // Se construye un array con cada id no encontrado o correspondiente
            // a un usuario ya contratado por una empresa para indicarlos como ids erróneos.
            const errorIds = [];
            for (const id of newHiresIds) {
                if (!usersMap[id]) {
                    errorIds.push({ id, error: "not found" });
                }
                else if (hiredUsersMap[id]) {
                    errorIds.push({ id, error: "already hired" });
                }
            }
            // Si el array de ids no validados tiene contenido, se retorna.
            if (errorIds.length > 0) {
                return errorIds;
            }
            // Se genera y ejecuta la query para insertar nuevos empleados a la empresa.
            const { query, params } = this.generateEmployeesInsertionQuery(newHiresIds, companyId);
            yield (0, connection_1.executeQuery)(query, params);
            // Se retorna un arreglo vacío indicando que no hay
            // contratados que no fueran encontrados en la BD.
            return [];
        });
    }
    /**
     * Genera una query para registrar a todos los nuevos contratados de una empresa.
     * @param newHiresIds Ids de usuario de todos los nuevos contratados.
     * @param companyId Id de la emprsa que contrata.
     * @returns Query y parámetros para la inserción de los nuevos empleados.
     */
    static generateEmployeesInsertionQuery(newHiresIds, companyId) {
        let query = "INSERT INTO Employees VALUES ";
        const params = [];
        for (const id of newHiresIds) {
            query += "(?, ?, ?, ?), ";
            params.push((0, uuid_1.generateUUID)(), id, companyId, (0, datetime_1.getDateString)());
        }
        query = query.substring(0, query.length - 2);
        return { query, params };
    }
}
exports.default = JobApplication;
//# sourceMappingURL=JobApplication.js.map