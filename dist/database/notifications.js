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
exports.readNotifications = exports.getUserNotifications = exports.databaseNotificationsHandler = exports.notificationsMapper = void 0;
const connection_1 = require("./connection");
/**
 * Formatea una notificación de la base de datos
 * @param notification - La notificación a formatear
 */
const notificationsMapper = (notification) => {
    const formatRelativeDate = (dateString) => {
        if (!dateString)
            return '';
        const notifDate = new Date(dateString);
        const today = new Date();
        notifDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);
        const diffMs = today.getTime() - notifDate.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        if (diffDays === 0)
            return "Hoy";
        if (diffDays === 1)
            return "Ayer";
        if (diffDays > 1 && diffDays < 5)
            return `Hace ${diffDays} días`;
        return notifDate.toLocaleDateString('es-MX', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };
    return {
        id: notification.id || '',
        userId: notification.userId || '',
        title: notification.title || '',
        description: notification.description || '',
        isRead: typeof notification.isRead === 'boolean'
            ? notification.isRead
            : Boolean(notification.isRead) || false,
        creationDate: formatRelativeDate(notification.creationDate)
    };
};
exports.notificationsMapper = notificationsMapper;
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
    const notifications = yield (0, connection_1.executeQuery)(`
        SELECT 
            id,
            user_id as userId,
            title,
            description,
            is_read as isRead,
            DATE(creation_date) as creationDate
        FROM Notifications WHERE user_id = ?;
        `, [userId]);
    return notifications.map(exports.notificationsMapper);
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