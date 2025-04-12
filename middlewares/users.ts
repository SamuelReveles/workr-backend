import { body } from 'express-validator';
import { validator } from './validator';

const INVALID_EMAIL = 'El correo ingresado no es válido';
const INVALID_FULLNAME = 'Es necesario enviar el nombre para completar la operación';
const INVALID_PASSWORD = 'Es necesario enviar la contraseña para completar la operación';
const INVALID_COUNTRY = 'Es necesario enviar la contraseña para completar la operación';

export const register = [
    body('email').notEmpty().isEmail().withMessage(INVALID_EMAIL),
    body('fullName').notEmpty().isEmail().withMessage(INVALID_FULLNAME),
    body('country').notEmpty().isString().withMessage(INVALID_COUNTRY),
    body('password').notEmpty().withMessage(INVALID_PASSWORD),
    validator,
];

export const login = [
    body('email').notEmpty().isEmail().withMessage(INVALID_EMAIL),
    body('password').notEmpty().withMessage(INVALID_PASSWORD),
    validator,
];
