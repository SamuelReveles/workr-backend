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
exports.getNotifications = exports.getProfilePicture = exports.getUserProfile = exports.updateUserProfile = exports.registerUser = void 0;
const notifications_1 = require("../database/notifications");
const User_1 = __importDefault(require("../models/User"));
const UserProfile_1 = __importDefault(require("../models/UserProfile"));
/**
 * Registra un nuevo usuario con los parámetros indicados en body.
 * @returns HTTP 201 si el usuario se registra correctamente,
 * HTTP 400 si los parámetros son incorrectos,
 * HTTP 500 si ocurre un error al procesar la request.
 */
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fullName, email, password, country } = req.body;
    try {
        const userId = yield User_1.default.create(fullName, email, password, country);
        yield (0, notifications_1.databaseNotificationsHandler)(userId, "Bienvenido a Work-R", "Completa tu perfil y empieza con la búsqueda de tu empleo");
        return res.sendStatus(201);
    }
    catch (e) {
        return res.sendStatus(500);
    }
});
exports.registerUser = registerUser;
/**
 * Actualiza el perfil de un usuario con los parámetros provistos
 * en la solicitud.
 * @returns HTTP 200 si el perfil se actualizó correctamente,
 * HTTP 500 si ocurrió un error al procesar la request.
 */
const updateUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield UserProfile_1.default.updateProfile(req.userId, req.files.profile_picture, req.body);
        return res.sendStatus(200);
    }
    catch (e) {
        return res.sendStatus(500);
    }
});
exports.updateUserProfile = updateUserProfile;
/**
 * Obtiene la información del perfil correspondiente al usuario cuyo id
 * se referencia en los parámetros del endpoint.
 * @returns HTTP 200 con los datos del perfil si se encuentra,
 * HTTP 404 si no se encuentra el perfil,
 * HTTP 500 si ocurre algún error al procesar la solicitud.
 */
const getUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const profile = yield UserProfile_1.default.getProfile(req.params.userId);
        if (profile == null) {
            return res.sendStatus(404);
        }
        else {
            return res.status(200).json(profile);
        }
    }
    catch (err) {
        return res.sendStatus(500);
    }
});
exports.getUserProfile = getUserProfile;
/**
 * Devuelve la foto de perfil referenciada con el id en los parámetros del endpoint.
 * @returns HTTP 200 con la foto de perfil solicitada si se encuentra,
 * HTTP 404 si no se encuentra la foto de perfil solicitada,
 * HTTP 500 si ocurre algún error al procesar la solicitud.
 */
const getProfilePicture = (req, res) => {
    try {
        const profilePicturePath = UserProfile_1.default.getProfilePicturePath(req.params.id);
        if (profilePicturePath == null) {
            return res.sendStatus(404);
        }
        else {
            return res.status(200).sendFile(profilePicturePath);
        }
    }
    catch (err) {
        return res.sendStatus(500);
    }
};
exports.getProfilePicture = getProfilePicture;
/**
 * Devuelve la foto de perfil referenciada con el id en los parámetros del endpoint.
 * @returns HTTP 200 con la foto de perfil solicitada si se encuentra,
 * HTTP 404 si no se encuentra la foto de perfil solicitada,
 * HTTP 500 si ocurre algún error al procesar la solicitud.
 */
const getNotifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const notifications = yield (0, notifications_1.getUserNotifications)(req.userId);
        yield (0, notifications_1.readNotifications)(req.userId);
        return res.status(200).json(notifications);
    }
    catch (err) {
        return res.sendStatus(500);
    }
});
exports.getNotifications = getNotifications;
//# sourceMappingURL=users.controller.js.map