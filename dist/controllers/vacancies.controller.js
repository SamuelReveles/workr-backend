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
exports.closeVacancy = exports.getVacancyDetails = exports.searchVacancy = exports.getCompanyVacancies = exports.postVacancy = void 0;
const Vacancy_1 = __importDefault(require("../models/Vacancy"));
/**
 * Registra una nueva vacante con la información dada en
 * la request.
 * @returns HTTP 201 si la vacante se registra correctamente,
 * HTTP 500 si ocurre un error al procesar la request.
 */
const postVacancy = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Vacancy_1.default.postVacancy(req.body, req.companyId);
        return res.sendStatus(201);
    }
    catch (err) {
        return res.sendStatus(500);
    }
});
exports.postVacancy = postVacancy;
/**
 * Consulta las vacantes publicadas por una empresa autenticada.
 * @returns HTTP 200 con un JSON que contiene los registros de vacantes
 * si la consulta se completa correctamente,
 * HTTP 500 si ocurre algún error al procesar la request.
 */
const getCompanyVacancies = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const vacancyData = yield Vacancy_1.default.getCompanyVacancies(req.companyId);
        return res.status(200).json(vacancyData);
    }
    catch (err) {
        return res.sendStatus(500);
    }
});
exports.getCompanyVacancies = getCompanyVacancies;
/**
 * Busca las vacantes que coincidan con los parámetros provistos
 * en la request.
 * @returns HTTP 200 con un JSON que contiene el listado de resultados
 * para la búsqueda de vacantes si se completa correctamente,
 * HTTP 500 si ocurre un error al procesar la request.
 */
const searchVacancy = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const searchResults = yield Vacancy_1.default.searchVacancies(req.body);
        return res.status(200).json(searchResults);
    }
    catch (err) {
        return res.sendStatus(500);
    }
});
exports.searchVacancy = searchVacancy;
/**
 * Obtiene los detalles de la vacante indicada en la ruta de solicitud.
 * @returns HTPP 200 con JSON conteniendo los detalles de la vacante
 * referenciada si se obtiene correctamente,
 * HTTP 404 si no se encuentra la vacante referenciada,
 * HTTP 500 si ocurre un error al procesar la request.
 */
const getVacancyDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const details = yield Vacancy_1.default.getVacancyDetails(req.params.vacancyId);
        if (details != null) {
            return res.status(200).json(details);
        }
        else {
            return res.sendStatus(404);
        }
    }
    catch (err) {
        return res.sendStatus(500);
    }
});
exports.getVacancyDetails = getVacancyDetails;
/**
 * Cierra una vacante para que ya no aparezca en resultados de búsqueda
 * y no pueda recibir nuevas solicitudes de aspirantes.
 * @returns HTTP 200 si la vacante existe y se cerró correctamente,
 * HTTP 404 si no se encontró la vacante,
 * HTTP 500 si ocurrió un error al procesar la request.
 */
const closeVacancy = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const closed = yield Vacancy_1.default.closeVacancy(req.params.vacancyId);
        if (closed != null) {
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
exports.closeVacancy = closeVacancy;
//# sourceMappingURL=vacancies.controller.js.map