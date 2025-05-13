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
exports.readNotifications = exports.getUserNotifications = exports.databaseNotificationsHandler = void 0;
const connection_1 = require("./connection");
/**
 * Crear una notificación de base de datos
 * @param userId - EL id del usuario al que se le va a enviar la notificación
 * @param title - El título de la notificación
 * @param description - La descripción de la notificación
 */
const databaseNotificationsHandler = (userId, title, description) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, connection_1.executeQuery)("INSERT INTO Notifications (user_id, title, description) VALUES (?, ?, ?)", [userId, title, description]);
});
exports.databaseNotificationsHandler = databaseNotificationsHandler;
/**
 * Obtener todas las notificaciones de un usuario
 * @param userId - El id del usuario al que se le van a obtener las notificaciones
 */
const getUserNotifications = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const notifications = yield (0, connection_1.executeQuery)(`SELECT * FROM Notifications WHERE user_id = ?`, [userId]);
    return notifications;
});
exports.getUserNotifications = getUserNotifications;
/**
 * Marcar las notificaciones de un usuarios como leídas
 * @param userId - El id del usuario que se leerán las notificaciones
 */
const readNotifications = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, connection_1.executeQuery)(`UPDATE Notifications SET is_read = 1 WHERE user_id = ?`, [userId]);
});
exports.readNotifications = readNotifications;
//# sourceMappingURL=notifications.js.map