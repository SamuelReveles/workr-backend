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

function messageFor(field: string) {
  return `Error en el campo ${field}, no se encontró o tiene tipo incorrecto`;
}