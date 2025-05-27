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
exports.getUsersInCompanyCall = exports.getEmployeeCompanyCallDirectory = exports.generateEmployeeCallAccessToken = void 0;
const Call_1 = __importDefault(require("../models/Call"));
/**
 * Genera un token de autenticación para un empleado en una llamada.
 * @returns HTTP 200 con un json que contiene el token si se encuentra
 * la información de empleado del usuario autenticado,
 * HTTP 404 si no se encuentra la información del empleado,
 * HTTP 500 si ocurre un error al procesar la request.
 */
const generateEmployeeCallAccessToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = yield Call_1.default.generateEmployeeCallToken(req.userId);
        if (token != null) {
            return res.status(200).json({ token });
        }
        else {
            return res.sendStatus(404);
        }
    }
    catch (err) {
        return res.sendStatus(500);
    }
});
exports.generateEmployeeCallAccessToken = generateEmployeeCallAccessToken;
/**
 * Obtiene el directorio de llamadas de la empresa a la que pertenece un empleado.
 * @returns HTTP 200 con un json que contiene el directorio si se
 * encuentra correctamente el registro de empleado del usuario autenticado,
 * HTTP 404 si no se encuentra el registro de empleado del usuario,
 * HTTP 500 si ocurre un error al procesar la request.
 */
const getEmployeeCompanyCallDirectory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const directory = yield Call_1.default.getEmployeeCompanyCallDirectory(req.userId);
        if (directory != null) {
            return res.status(200).json({ directory });
        }
        else {
            return res.sendStatus(404);
        }
    }
    catch (err) {
        return res.sendStatus(500);
    }
});
exports.getEmployeeCompanyCallDirectory = getEmployeeCompanyCallDirectory;
/**
 * Obtiene los usuarios conectados en una llamada de la empresa
 * a la que pertenece un empleado.
 * @returns HTTP 200 con un json que contiene la lista de usuarios en la
 * llamada de la empresa a la que pertenece el empleado autenticado
 * si es que se encuentra el registro de empleado,
 * HTTP 404 si no se encuentra el registro de empleado,
 * HTTP 500 si ocurre un error al procesar la request.
 */
const getUsersInCompanyCall = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield Call_1.default.getUsersInCompanyCall(req.userId);
        if (users != null) {
            return res.status(200).json({ users });
        }
        else {
            return res.sendStatus(404);
        }
    }
    catch (err) {
        return res.sendStatus(500);
    }
});
exports.getUsersInCompanyCall = getUsersInCompanyCall;
//# sourceMappingURL=calls.controller.js.map