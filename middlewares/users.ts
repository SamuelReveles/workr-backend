import { body } from 'express-validator';
import { validator } from './validator';

const INVALID_EMAIL = 'El correo ingresado no es válido';
const INVALID_PASSWORD = 'Es necesario enviar la contraseña para completar el registro';

export const register = [
    body('email').notEmpty().isEmail().withMessage(INVALID_EMAIL),
    body('password').notEmpty().withMessage(INVALID_PASSWORD),
    validator,
];
