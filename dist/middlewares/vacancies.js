"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.search = exports.post = void 0;
const express_validator_1 = require("express-validator");
const validator_1 = require("./validator");
const customValidators_1 = require("./customValidators");
const orderColumns = ["creation_date", "position", "company"];
const orderDirections = ["ASC", "DESC"];
exports.post = [
    (0, express_validator_1.body)("position").notEmpty().isString().withMessage(messageFor("position")),
    (0, express_validator_1.body)("officeAddress").notEmpty().isString().withMessage(messageFor("officeAddress")),
    (0, express_validator_1.body)("workModality").notEmpty().isString().withMessage(messageFor("workModality")),
    (0, express_validator_1.body)("workDays").notEmpty().isString().withMessage(messageFor("workDays")),
    (0, express_validator_1.body)("dailySchedule").notEmpty().isString().withMessage(messageFor("dailySchedule")),
    (0, express_validator_1.body)("description").notEmpty().isString().withMessage(messageFor("description")),
    (0, express_validator_1.body)("skills").custom(customValidators_1.skillsValidator),
    validator_1.validator,
];
exports.search = [
    (0, express_validator_1.body)("position").isString().withMessage(messageFor("position")),
    (0, express_validator_1.body)("location").isString().withMessage(messageFor("location")),
    (0, express_validator_1.body)("company").isString().withMessage(messageFor("company")),
    (0, express_validator_1.body)("orderBy").notEmpty().isString().isIn(orderColumns).withMessage(messageFor("orderBy", orderColumns)),
    (0, express_validator_1.body)("orderDirection").notEmpty().isString().isIn(orderDirections).withMessage(messageFor("orderDirection", orderDirections)),
    validator_1.validator,
];
function messageFor(field, options) {
    if (options == null || options.length == 0) {
        return `Error en el campo ${field}, no se encontró o tiene tipo incorrecto`;
    }
    else {
        return `Error en el campo ${field}, debe coincidir en tipo y valor con las opciones: ${options}`;
    }
}
//# sourceMappingURL=vacancies.js.map