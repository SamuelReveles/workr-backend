import { body } from "express-validator";
import { validator } from "./validator";
import { contactLinksValidator } from "./customValidators";

export const register = [
  body("adminEmail").notEmpty().isEmail().withMessage(messageFor("adminEmail")),
  body("adminPassword").notEmpty().isString().withMessage(messageFor("adminPassword")),
  body("name").notEmpty().isString().withMessage(messageFor("name")),
  body("commercialSector").notEmpty().isString().withMessage(messageFor("commercialSector")),
  body("employeeCount").notEmpty().isInt().withMessage(messageFor("employeeCount")),
  body("type").notEmpty().isString().withMessage(messageFor("type")),
  validator,
];

export const updateProfile = [
  body("description").notEmpty().isString().withMessage(messageFor("description")),
  body("mission").notEmpty().isString().withMessage(messageFor("mission")),
  body("vision").notEmpty().isString().withMessage(messageFor("vision")),
  body("address").notEmpty().isString().withMessage(messageFor("address")),
  body("contactLinks").custom(contactLinksValidator),
  validator,
];

/**
 * Genera un mensaje de error para el campo indicado.
 * @param field Campo con error.
 * @returns String que contiene el mensaje de error generado.
 */
function messageFor(field: string) {
  return `Hay un error en el campo '${field}': No se encuentra o es de tipo incorrecto`;
}