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
const encryption_1 = require("../helpers/encryption");
const uuid_1 = require("../helpers/uuid");
const datetime_1 = require("../helpers/datetime");
class User {
    /**
     * Crea un usuario en la BD con los datos indicados
     * @param fullName Nombre completo del usuario.
     * @param email Correo del usuario.
     * @param password Contraseña del usuario
     * (a hashear para almacenar de forma segura).
     * @param country País del usuario.
     * @returns Una promise que se resuelve si el
     * usuario se registra correctamente.
     */
    static create(fullName, email, password, country) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = (0, uuid_1.generateUUID)();
            const hashedPassword = (0, encryption_1.hashPassword)(password);
            const emptyProfilePicture = "";
            const emptyDescription = "";
            const currentDate = (0, datetime_1.getDateString)();
            const query = "INSERT INTO Users"
                + "(id, full_name, email, hashed_password, profile_picture,"
                + " description, country, creation_date, last_update_date)"
                + " VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)";
            const parameters = [
                id,
                fullName,
                email,
                hashedPassword,
                emptyProfilePicture,
                emptyDescription,
                country,
                currentDate,
                currentDate
            ];
            yield (0, connection_1.executeQuery)(query, parameters);
            return id;
        });
    }
    /**
     * Borra al usuario referenciado de los registros de empleado
     * que lo relacionan con una empresa.
     * @param userId Id del usuario que renuncia.
     * @returns True si la renuncia se procesa correctamente,
     * False si no se encontró el registro del empleado para borrarlo.
     */
    static quitJob(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const employeeRecordResults = yield (0, connection_1.executeQuery)("SELECT id FROM Employees WHERE user_id = ? AND is_active = TRUE", userId);
            // Si no se encuentra el registro de empleado se devuelve False.
            if (employeeRecordResults.length == 0) {
                return false;
            }
            // Si se encuentra el registro, se borra para la renuncia
            // y se devuelve True.
            else {
                yield (0, connection_1.executeQuery)(
                // "DELETE FROM Employees WHERE user_id = ?",
                "UPDATE Employees SET is_active = FALSE WHERE user_id = ?", userId);
                return true;
            }
        });
    }
    /**
     * Cierra la sesión de trabajo referenciada.
     * @param workSessionId Id de la sesión a cerrar.
     * @returns True si el cierre se realiza correctamente, false si no
     * se encuentra la sesión.
     */
    static checkoutWorkSession(workSessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Se busca información de la sesión.
            const sessionResults = yield (0, connection_1.executeQuery)("SELECT start_time FROM Work_sessions WHERE id = ?", [workSessionId]);
            // Si la búsqueda no arroja resultados significa que la sesión no existe,
            // por lo tanto se devuelve false.
            if (sessionResults.length === 0) {
                return false;
            }
            // Se obtienen los datos completos de tiempos.
            const todayString = (0, datetime_1.getDateString)();
            const startTimeString = sessionResults[0]["start_time"];
            const endTimeString = (0, datetime_1.getTimeString)();
            // Se calcula la diferencia de minutos entre el inicio y término de la sesión.
            const startTime = new Date(`${todayString}T${startTimeString}Z`);
            const endTime = new Date(`${todayString}T${endTimeString}Z`);
            const minutesDifference = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60));
            // Se actualiza el registro de la sesión con los datos de cierre.
            const checkoutValues = {
                end_time: endTimeString,
                minutes: minutesDifference
            };
            yield (0, connection_1.executeQuery)("UPDATE Work_sessions SET ? WHERE id = ?", [checkoutValues, workSessionId]);
            // Se retorna true para indicar update correcto.
            return true;
        });
    }
}
exports.default = User;
//# sourceMappingURL=User.js.map