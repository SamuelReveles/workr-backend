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
exports.getProfilePicture = exports.getCompanyProfile = exports.updateCompanyProfile = exports.registerCompany = void 0;
const Company_1 = __importDefault(require("../models/Company"));
/**
 * Registra una empresa tomando los datos de la solicitud.
 * @returns HTTP 201 si la empresa se registra exitosamente,
 * HTTP 500 si ocurre un error al procesar la request.
 */
const registerCompany = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Company_1.default.register(req.files.profile_picture, req.body);
        return res.sendStatus(201);
    }
    catch (err) {
        return res.sendStatus(500);
    }
});
exports.registerCompany = registerCompany;
/**
 * Actualiza los datos de perfil de una empresa tomando los datos de la solicitud.
 * @returns HTTP 200 si la actualización se completa correctamente,
 * HTTP 500 si ocurre algún error al procesar la request.
 */
const updateCompanyProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Company_1.default.updateProfile(req.companyId, req.files.profile_picture, req.body);
        return res.sendStatus(200);
    }
    catch (err) {
        return res.sendStatus(500);
    }
});
exports.updateCompanyProfile = updateCompanyProfile;
/**
 * Obtiene la información del perfil correspondiente a la empresa cuyo id
 * se referencia en los parámetros del endpoint.
 * @returns HTTP 200 con los datos del perfil si se encuentra,
 * HTTP 404 si no se encuentra el perfil,
 * HTTP 500 si ocurre algún error al procesar la solicitud.
 */
const getCompanyProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const profile = yield Company_1.default.getProfile(req.params.companyId);
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
exports.getCompanyProfile = getCompanyProfile;
/**
 * Devuelve la foto de perfil referenciada con el id en los parámetros del endpoint.
 * @returns HTTP 200 con la foto de perfil solicitada si se encuentra,
 * HTTP 404 si no se encuentra la foto de perfil solicitada,
 * HTTP 500 si ocurre algún error al procesar la solicitud.
 */
const getProfilePicture = (req, res) => {
    try {
        const profilePicturePath = Company_1.default.getProfilePicturePath(req.params.id);
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
//# sourceMappingURL=companies.controller.js.map