import { body } from "express-validator";
import { validator } from "./validator";
import { skillsValidator } from "./customValidators";

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
  body("orderBy").notEmpty().isString().withMessage(messageFor("orderBy")),
  body("orderDirection").notEmpty().isString().withMessage(messageFor("orderDirection")),
  validator,
];

function messageFor(field: string) {
  return `Error en el campo ${field}, no se encontró o tiene tipo incorrecto`;
}