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
            // Si el email coincide con un registro de usuario, se entiende un tipo de login de usuario.
            if (queryResults.length != 0) {
                loginType = "user";
            }
            else {
                // Si el email no coincide con un usuario, se intenta un login de empresa.
                queryResults = yield (0, connection_1.executeQuery)("SELECT id, hashed_admin_password FROM Companies WHERE admin_email = ?", [email]);
                // Si el email coincide con un registro de empresa, se entiende un tipo de login de empresa.
                if (queryResults.length != 0) {
                    loginType = "company";
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
                const jwt = (0, jwt_1.generateJWT)(queryResults[0]["id"], loginType);
                return Promise.resolve({ jwt, id: queryResults[0]["id"] });
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