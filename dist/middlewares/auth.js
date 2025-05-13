"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const express_validator_1 = require("express-validator");
const validator_1 = require("./validator");
const INVALID_EMAIL = 'El correo ingresado no es válido';
const INVALID_PASSWORD = 'Es necesario enviar la contraseña para completar la operación';
exports.login = [
    (0, express_validator_1.body)('email').notEmpty().isEmail().withMessage(INVALID_EMAIL),
    (0, express_validator_1.body)('password').notEmpty().withMessage(INVALID_PASSWORD),
    validator_1.validator,
];
//# sourceMappingURL=auth.js.map