import { body } from "express-validator";
import { validator } from "./validator";
import { skillsValidator } from "./customValidators";

const orderColumns = ["creation_date", "position", "company"];
const orderDirections = ["ASC", "DESC"];

export const post = [
  body("position").notEmpty().isString().withMessage(messageFor("position")),
  body("officeAddress").notEmpty().isString().withMessage(messageFor("officeAddress")),
  body("workModality").notEmpty().isString().withMessage(messageFor("workModality")),
  body("workDays").notEmpty().isString().withMessage(messageFor("workDays")),
  body("dailySchedule").notEmpty().isString().withMessage(messageFor("dailySchedule")),
  body("description").notEmpty().isString().withMessage(messageFor("description")),
  body("skills").custom(skillsValidator),
  validator,
];

export const search = [
  body("position").isString().withMessage(messageFor("position")),
  body("location").isString().withMessage(messageFor("location")),
  body("company").isString().withMessage(messageFor("company")),
  body("orderBy").notEmpty().isString().isIn(orderColumns).withMessage(messageFor("orderBy", orderColumns)),
  body("orderDirection").notEmpty().isString().isIn(orderDirections).withMessage(messageFor("orderDirection", orderDirections)),
  validator,
];

function messageFor(field: string, options?: any[]) {
  if (options == null || options.length == 0) {
    return `Error en el campo ${field}, no se encontró o tiene tipo incorrecto`;
  }
  else {
    return `Error en el campo ${field}, debe coincidir en tipo y valor con las opciones: ${options}`;
  }
}