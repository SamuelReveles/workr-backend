import { body } from "express-validator";
import { validator } from "./validator";

export const register = [
  body("phoneNumber").notEmpty().isString().isMobilePhone("any").withMessage(messageFor("phoneNumber")),
  body("highestEducationLevel").notEmpty().isString().withMessage(messageFor("highestEducationLevel")),
  body("experience").notEmpty().isString().withMessage(messageFor("experience")),
  body("hardSkills").notEmpty().isString().withMessage(messageFor("hardSkills")),
  body("softSkills").notEmpty().isString().withMessage(messageFor("softSkills")),
  body("applicationReason").notEmpty().isString().withMessage(messageFor("applicationReason")),
  body("portfolioLink").notEmpty().isString().isURL({
    allow_underscores: true,
  }).withMessage(messageFor("portfolioLink")),
  body("vacancyId").notEmpty().isString().withMessage(messageFor("vacancyId")),
  validator,
];

export const vacancyApplicants = [
  body("vacancyId").notEmpty().isString().withMessage(messageFor("vacancyId")),
  validator,
]

function messageFor(field: string) {
  return `Error en el campo ${field}, no se encontró o tiene tipo o formato incorrecto`;
}