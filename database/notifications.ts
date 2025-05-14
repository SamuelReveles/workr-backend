import { executeQuery } from "./connection"

/**
 * Crear una notificación de base de datos
 * @param userId - EL id del usuario al que se le va a enviar la notificación 
 * @param title - El título de la notificación
 * @param description - La descripción de la notificación
 */
export const databaseNotificationsHandler = async (userId, title, description) => {
    await executeQuery(
        "INSERT INTO Notifications (user_id, title, description) VALUES (?, ?, ?)",
        [userId, title, description]
    );
}

/**
 * Obtener todas las notificaciones de un usuario
 * @param userId - El id del usuario al que se le van a obtener las notificaciones
 */
export const getUserNotifications = async (userId) => {
    const notifications = await executeQuery(
        `SELECT * FROM Notifications WHERE user_id = ?`,
        [userId]
    );
    return notifications;
}

/**
 * Marcar las notificaciones de un usuarios como leídas
 * @param userId - El id del usuario que se leerán las notificaciones
 */
export const readNotifications = async (userId) => {
    await executeQuery(
        `UPDATE Notifications SET is_read = 1 WHERE user_id = ?`,
        [userId]
    );
}