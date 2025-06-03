"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.workSession = exports.updateProfile = exports.register = void 0;
const express_validator_1 = require("express-validator");
const validator_1 = require("./validator");
const customValidators_1 = require("./customValidators");
const INVALID_EMAIL = 'El correo ingresado no es válido';
const INVALID_FULLNAME = 'Es necesario enviar el nombre para completar la operación';
const INVALID_PASSWORD = 'Es necesario enviar la contraseña para completar la operación';
const INVALID_COUNTRY = 'Es necesario enviar el país de origen para completar la operación';
const INVALID_DESCRIPTION = 'Es necesario enviar una descripción para completar la operación';
const INVALID_WORK_SESSION_ID = "Es necesario enviar el id de sesión de trabajo para completar la operación";
exports.register = [
    (0, express_validator_1.body)('email').notEmpty().isEmail().withMessage(INVALID_EMAIL),
    (0, express_validator_1.body)('fullName').notEmpty().isString().withMessage(INVALID_FULLNAME),
    (0, express_validator_1.body)('country').notEmpty().isString().withMessage(INVALID_COUNTRY),
    (0, express_validator_1.body)('password').notEmpty().withMessage(INVALID_PASSWORD),
    validator_1.validator,
];
exports.updateProfile = [
    (0, express_validator_1.body)('description').notEmpty().isString().withMessage(INVALID_DESCRIPTION),
    (0, express_validator_1.body)('contactLinks').custom(customValidators_1.contactLinksValidator),
    (0, express_validator_1.body)('experience').custom(customValidators_1.experienceValidator),
    (0, express_validator_1.body)('skills').custom(customValidators_1.skillsValidator),
    (0, express_validator_1.body)('education').custom(customValidators_1.educationValidator),
    validator_1.validator,
];
exports.workSession = [
    (0, express_validator_1.body)("workSessionId").notEmpty().isString().withMessage(INVALID_WORK_SESSION_ID),
    validator_1.validator,
];
//# sourceMappingURL=users.js.map