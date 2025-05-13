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
        });
    }
}
exports.default = User;
//# sourceMappingURL=User.js.map