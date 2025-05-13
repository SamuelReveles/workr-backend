"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.register = void 0;
const express_validator_1 = require("express-validator");
const validator_1 = require("./validator");
const customValidators_1 = require("./customValidators");
exports.register = [
    (0, express_validator_1.body)("adminEmail").notEmpty().isEmail().withMessage(messageFor("adminEmail")),
    (0, express_validator_1.body)("adminPassword").notEmpty().isString().withMessage(messageFor("adminPassword")),
    (0, express_validator_1.body)("name").notEmpty().isString().withMessage(messageFor("name")),
    (0, express_validator_1.body)("commercialSector").notEmpty().isString().withMessage(messageFor("commercialSector")),
    (0, express_validator_1.body)("employeeCount").notEmpty().isInt().withMessage(messageFor("employeeCount")),
    (0, express_validator_1.body)("type").notEmpty().isString().withMessage(messageFor("type")),
    validator_1.validator,
];
exports.updateProfile = [
    (0, express_validator_1.body)("description").notEmpty().isString().withMessage(messageFor("description")),
    (0, express_validator_1.body)("mission").notEmpty().isString().withMessage(messageFor("mission")),
    (0, express_validator_1.body)("vision").notEmpty().isString().withMessage(messageFor("vision")),
    (0, express_validator_1.body)("address").notEmpty().isString().withMessage(messageFor("address")),
    (0, express_validator_1.body)("contactLinks").custom(customValidators_1.contactLinksValidator),
    validator_1.validator,
];
/**
 * Genera un mensaje de error para el campo indicado.
 * @param field Campo con error.
 * @returns String que contiene el mensaje de error generado.
 */
function messageFor(field) {
    return `Hay un error en el campo '${field}': No se encuentra o es de tipo incorrecto`;
}
//# sourceMappingURL=companies.js.map