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
const jwt_1 = require("../helpers/jwt");
const uuid_1 = require("../helpers/uuid");
const datetime_1 = require("../helpers/datetime");
class Auth {
    /**
     * Valida las credenciales de un intento de login para autenticar a un usuario o empresa.
     * @param email Correo ingresado identificando al usuario o empresa.
     * @param password Contraseña ingresada, usada para autenticación.
     * @returns Una promise que se resuelve con un JWT si se logra una autenticación,
     * o que se rechaza de otro modo.
     */
    static validateCredentials(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            // Primero se intenta hacer un login como usuario.
            let queryResults = yield (0, connection_1.executeQuery)("SELECT id, hashed_password FROM Users WHERE email = ?", [email]);
            let loginType = "";
            let employeeId = "";
            let virtualOfficeCompanyId = "";
            // Si el email coincide con un registro de usuario, se entiende un tipo de login de usuario.
            if (queryResults.length != 0) {
                loginType = "user";
                // Se determina si el usuario trabaja para una empresa,
                // si es así se recupera el id de la empresa para acceder a la oficina virtual,
                // si no, se devolverá una cadena vacía por defecto en el campo de referencia.
                let employeeResults = yield (0, connection_1.executeQuery)("SELECT id, company_id FROM Employees WHERE user_id = ? AND is_active = TRUE", queryResults[0]["id"]);
                if (employeeResults.length > 0) {
                    employeeId = employeeResults[0]["id"];
                    virtualOfficeCompanyId = employeeResults[0]["company_id"];
                }
            }
            else {
                // Si el email no coincide con un usuario, se intenta un login de empresa.
                queryResults = yield (0, connection_1.executeQuery)("SELECT id, hashed_admin_password FROM Companies WHERE admin_email = ?", [email]);
                // Si el email coincide con un registro de empresa, se entiende un tipo de login de empresa.
                if (queryResults.length != 0) {
                    loginType = "company";
                    // Se incluye el id de la empresa en el campo de
                    // referencia para la oficina virtual.
                    virtualOfficeCompanyId = queryResults[0]["id"];
                }
                // Si el email no coincidió de nuevo, se rechaza la promesa de login.
                else {
                    return Promise.reject(new Error("Unauthorized"));
                }
            }
            // Según el tipo de login se valida la contraseña con el campo adecuado.
            const storedPassword = queryResults[0][loginType == "user" ? "hashed_password" : "hashed_admin_password"];
            // Si la contraseña coincide con la almacenada, se resuelve la promesa de login
            // creando un jwt de autenticación.
            if ((0, encryption_1.isPasswordEqualToStored)(password, storedPassword)) {
                // Si el inicio de sesión es de un empleado, se registra el inicio de su sesión de trabajo.
                let workSessionId = "";
                if (employeeId !== "") {
                    workSessionId = (0, uuid_1.generateUUID)();
                    const workSessionData = {
                        id: workSessionId,
                        employee_id: employeeId,
                        date: (0, datetime_1.getDateString)(),
                        start_time: (0, datetime_1.getTimeString)(),
                    };
                    yield (0, connection_1.executeQuery)("INSERT INTO Work_sessions SET ?", [workSessionData]);
                }
                const jwt = (0, jwt_1.generateJWT)(queryResults[0]["id"], loginType);
                return Promise.resolve({ jwt, id: queryResults[0]["id"], loginType, virtualOfficeCompanyId, workSessionId });
            }
            // Si las contraseñas no coinciden, se rechaza la promesa de login.
            else {
                return Promise.reject(new Error("Unauthorized"));
            }
        });
    }
}
exports.default = Auth;
//# sourceMappingURL=Auth.js.map