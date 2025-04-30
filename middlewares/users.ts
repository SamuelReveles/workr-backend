import { body } from 'express-validator';
import { validator } from './validator';
import { contactLinksValidator, educationValidator, experienceValidator, skillsValidator } from './customValidators';

const INVALID_EMAIL = 'El correo ingresado no es válido';
const INVALID_FULLNAME = 'Es necesario enviar el nombre para completar la operación';
const INVALID_PASSWORD = 'Es necesario enviar la contraseña para completar la operación';
const INVALID_COUNTRY = 'Es necesario enviar el país de origen para completar la operación';
const INVALID_DESCRIPTION = 'Es necesario enviar una descripción para completar la operación';

export const register = [
    body('email').notEmpty().isEmail().withMessage(INVALID_EMAIL),
    body('fullName').notEmpty().isEmail().withMessage(INVALID_FULLNAME),
    body('country').notEmpty().isString().withMessage(INVALID_COUNTRY),
    body('password').notEmpty().withMessage(INVALID_PASSWORD),
    validator,
];

export const updateProfile = [
    body('description').notEmpty().isString().withMessage(INVALID_DESCRIPTION),
    body('contactLinks').custom(contactLinksValidator),
    body('experience').custom(experienceValidator),
    body('skills').custom(skillsValidator),
    body('education').custom(educationValidator),
    validator,
]