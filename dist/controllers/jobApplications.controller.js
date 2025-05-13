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
exports.registerNewHires = exports.updateInterviewNotes = exports.getInterviewNotes = exports.getContactedVacancyApplicants = exports.registerInterview = exports.getJobApplicationFormAnswers = exports.getVacancyApplicants = exports.registerApplicant = void 0;
const JobApplication_1 = __importDefault(require("../models/JobApplication"));
/**
 * Registra a un nuevo aspirante autenticado a una vacante usando la
 * información de la solicitud.
 * @returns HTTP 201 si se registra el aspirante correctamente,
 * HTTP 500 si ocurre un error al procesar la solicitud.
 */
const registerApplicant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield JobApplication_1.default.register(req.userId, req.body);
        return res.sendStatus(201);
    }
    catch (err) {
        return res.sendStatus(500);
    }
});
exports.registerApplicant = registerApplicant;
/**
 * Obtiene los aspirantes a una vacante especificada en la solicitud.
 * @returns HTTP 200 con JSON que contiene un listado con
 * información resumida de los aspirantes a la vacante,
 * HTTP 404 si no se encuentra la vacante indicada,
 * HTTP 500 si ocurre un error al procesar la solicitud.
 */
const getVacancyApplicants = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const applicants = yield JobApplication_1.default.getVacancyApplicants(req.body.vacancyId);
        if (applicants != null) {
            return res.status(200).json(applicants);
        }
        else {
            return res.sendStatus(404);
        }
    }
    catch (err) {
        return res.sendStatus(500);
    }
});
exports.getVacancyApplicants = getVacancyApplicants;
/**
 * Obtiene las respuestas al formulario de solicitud de empleo
 * para la solicitud referenciada si es que existe.
 * @returns HTTP 200 con JSON que contiene las respuestas
 * al formulario de solicitud de empleo si se encuentra la solicitud,
 * HTTP 404 si no se encuentra la solicitud de empleo,
 * HTTP 500 si ocurre un error al procesar la request.
 */
const getJobApplicationFormAnswers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const formAnswers = yield JobApplication_1.default.getFormAnswers(req.body.jobApplicationId);
        if (formAnswers != null) {
            return res.status(200).json(formAnswers);
        }
        else {
            return res.sendStatus(404);
        }
    }
    catch (err) {
        return res.sendStatus(500);
    }
});
exports.getJobApplicationFormAnswers = getJobApplicationFormAnswers;
/**
 * Registra un agendado de entrevista para una solicitud de empleo referenciada.
 * @returns HTTP 200 si el agendado se registró correctamente,
 * HTTP 404 si no se encontró la solicitud de empleo asociada,
 * HTTP 500 si ocurre un error al procesar la request.
 */
const registerInterview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const scheduled = yield JobApplication_1.default.registerInterview(req.body.jobApplicationId);
        if (scheduled != null) {
            return res.sendStatus(200);
        }
        else {
            return res.sendStatus(404);
        }
    }
    catch (err) {
        return res.sendStatus(500);
    }
});
exports.registerInterview = registerInterview;
/**
 * Devuelve un listado de los aspirantes que fueron contactados con
 * una entrevista agendada para la vacante referenciada, si existe.
 * @returns HTTP 200 con un JSON que contiene el listado con información
 * resumida de los aspirantes contactados si los datos se obtienen correctamente,
 * HTTP 404 si no se encuentra la vacante referenciada,
 * HTTP 500 si ocurre un error al procesar la request.
 */
const getContactedVacancyApplicants = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contactedApplicants = yield JobApplication_1.default.getContactedVacancyApplicants(req.body.vacancyId);
        if (contactedApplicants != null) {
            return res.status(200).json(contactedApplicants);
        }
        else {
            return res.sendStatus(404);
        }
    }
    catch (err) {
        return res.sendStatus(500);
    }
});
exports.getContactedVacancyApplicants = getContactedVacancyApplicants;
/**
 * Obtiene las notas de entrevista con el id referenciado si existen.
 * @returns HTTP 200 con un JSON que contiene las notas de entrevista
 * si se obtienen correctamente,
 * HTTP 404 si no se encuentran las notas referenciadas,
 * HTTP 500 si ocurre un error al procesar la request.
 */
const getInterviewNotes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const interviewNotes = yield JobApplication_1.default.getInterviewNotes(req.body.interviewNotesId);
        if (interviewNotes != null) {
            return res.status(200).json(interviewNotes);
        }
        else {
            return res.sendStatus(404);
        }
    }
    catch (err) {
        return res.sendStatus(500);
    }
});
exports.getInterviewNotes = getInterviewNotes;
/**
 * Actualiza las notas de una entrevista referenciada.
 * @returns HTTP 200 si las notas se actualizaron correctamente,
 * HTTP 404 si no se encontró un registro para las notas referenciadas,
 * HTTP 500 si ocurre un error al procesar la request.
 */
const updateInterviewNotes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updated = yield JobApplication_1.default.updateInterviewNotes(req.body.interviewNotesId, req.body.interviewNotes);
        if (updated != null) {
            return res.sendStatus(200);
        }
        else {
            return res.sendStatus(404);
        }
    }
    catch (err) {
        return res.sendStatus(500);
    }
});
exports.updateInterviewNotes = updateInterviewNotes;
/**
 * Agrega una lista de empleados recién contratados a la BD.
 * @returns HTTP 201 si los contratados se registran correctamente,
 * HTTP 404 con un JSON que contiene ids de los contratados no encontrados
 * en la BD si es que hay alguno no encontrado,
 * HTTP 500 si ocurre un error al procesar la request.
 */
const registerNewHires = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const notFoundUsers = yield JobApplication_1.default.registerNewHires(req.body.newHiresIds, req.companyId);
        if (notFoundUsers.length == 0) {
            return res.sendStatus(201);
        }
        else {
            return res.status(404).json({ notFoundUsers });
        }
    }
    catch (err) {
        return res.sendStatus(500);
    }
});
exports.registerNewHires = registerNewHires;
//# sourceMappingURL=jobApplications.controller.js.map