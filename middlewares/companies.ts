import { body } from "express-validator";
import { validator } from "./validator";

export const register = [
  body("adminEmail").notEmpty().isEmail().withMessage(messageFor("adminEmail")),
  body("adminPassword").notEmpty().isString().withMessage(messageFor("adminPassword")),
  body("name").notEmpty().isString().withMessage(messageFor("name")),
  body("commercialSector").notEmpty().isString().withMessage(messageFor("commercialSector")),
  body("employeeCount").notEmpty().isInt().withMessage(messageFor("employeeCount")),
  body("type").notEmpty().isString().withMessage(messageFor("type")),
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