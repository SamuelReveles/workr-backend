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
exports.validateCallRequestContext = validateCallRequestContext;
const connection_1 = require("../database/connection");
const datetime_1 = require("../helpers/datetime");
/**
 * Verifica información contextual de una solicitud realizada
 * a un endpoint de llamadas.
 */
function validateCallRequestContext(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!isValidCallingTime()) {
                console.log("invalid calling time");
                return res.sendStatus(404);
            }
            if (isRequestLimitSurpassed()) {
                console.log("too many requests");
                return res.sendStatus(404);
            }
            if (!(yield isValidCallUserAuthData(req.userId, req.body.companyId))) {
                console.log("invalid user call auth");
                return res.sendStatus(404);
            }
        }
        catch (err) {
            console.error(err);
            return res.sendStatus(404);
        }
        PassedRequestsCounter.increase();
        next();
    });
}
/**
 * Verifica si el tiempo actual es válido para el uso de las funciones
 * de llamada.
 * @returns True si el tiempo actual está en el periodo válido para
 * funciones de llamada, False de otro modo.
 */
function isValidCallingTime() {
    // Se obtiene y verifica la configuración del periodo de llamadas.
    const callsPeriodStartString = process.env.CALLS_PERIOD_START;
    const callsPeriodEndString = process.env.CALLS_PERIOD_END;
    if (!callsPeriodStartString || !(0, datetime_1.isValidDateTimeString)(callsPeriodStartString)) {
        throw new Error("Incorrecta configuración de periodo de llamadas");
    }
    if (!callsPeriodEndString || !(0, datetime_1.isValidDateTimeString)(callsPeriodEndString)) {
        throw new Error("Incorrecta configuración de periodo de llamadas");
    }
    // Se obtienen los objetos Date para comparación.
    const callsPeriodStart = new Date(callsPeriodStartString);
    const currentTime = (0, datetime_1.getCurrentTime)();
    const callsPeriodEnd = new Date(callsPeriodEndString);
    // Se hace la validación del periodo de llamadas.
    return (currentTime > callsPeriodStart && currentTime < callsPeriodEnd);
}
/**
 * Valida si se ha superado el límite configurado de solicitudes de llamada.
 * @returns True si se superó el límite, False de otro modo.
 */
function isRequestLimitSurpassed() {
    // Se obtiene la configuración del límite de solicitudes de llamada.
    const callRequestsLimitString = process.env.CALL_REQUESTS_LIMIT;
    if (!callRequestsLimitString || isNaN(Number(callRequestsLimitString))) {
        throw new Error("Incorrecta configuración de límite de solicitudes de llamada");
    }
    const callRequestsLimit = Number(callRequestsLimitString);
    // Se verifica si se ha llegado al límite configurado.
    return PassedRequestsCounter.getCounter() >= callRequestsLimit;
}
/**
 * Verifica si la información de autenticación para llamadas de un
 * usuario registrado como empleado es válida.
 * @param userId Id del usuario autenticado por JWT.
 * @param companyId Id de la empresa en la que el usuario intenta llamar.
 * @returns True si la información de autenticación de llamadas del empleado
 * es válida, False de otro modo.
 */
function isValidCallUserAuthData(userId, companyId) {
    return __awaiter(this, void 0, void 0, function* () {
        // Si no se provee el id de empresa la validación no se aprueba.
        if (!companyId || companyId === "") {
            console.log("no company id");
            return false;
        }
        // Se busca la información del empleado que hizo la solicitud.
        const employeeResults = yield (0, connection_1.executeQuery)("SELECT call_user_id, company_id FROM Employees WHERE user_id = ?", [userId]);
        // Si la busqueda no obtiene resultados la validación no se aprueba.
        if (employeeResults.length == 0) {
            return false;
        }
        const employeeData = employeeResults[0];
        // Se verifican los datos de llamada del usuario:
        // - Debe tener un id de llamada
        // - El id de empresa de la solicitud debe coincidir con el de la BD.
        return (employeeData["call_user_id"] && employeeData["company_id"] === companyId);
    });
}
/**
 * Clase auxiliar para un contador estático de solicitudes de
 * llamadas que han pasado más allá del middleware.
 */
class PassedRequestsCounter {
    static increase() {
        this.counter++;
    }
    static getCounter() {
        return this.counter;
    }
}
PassedRequestsCounter.counter = 0;
//# sourceMappingURL=callsContextValidation.js.map