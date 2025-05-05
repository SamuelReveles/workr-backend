import { body } from "express-validator";
import { validator } from "./validator";

export const register = [
  body("contactEmail").notEmpty().isString().isEmail().withMessage(messageFor("contactEmail")),
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
];

export const formAnswers = [
  body("jobApplicationId").notEmpty().isString().withMessage(messageFor("jobApplicationId")),
  validator,
];

export const interview = [
  body("jobApplicationId").notEmpty().isString().withMessage(messageFor("jobApplicationId")),
  validator,
];

export const contactedApplicants = [
  body("vacancyId").notEmpty().isString().withMessage(messageFor("vacancyId")),
  validator,
];

export const interviewNotes = [
  body("interviewNotesId").notEmpty().isString().withMessage(messageFor("interviewNotesId")),
  validator,
];

export const updatedInterviewNotes = [
  body("interviewNotesId").notEmpty().isString().withMessage(messageFor("interviewNotesId")),
  body("interviewNotes").notEmpty().isString().withMessage(messageFor("interviewNotes")),
  validator,
];

function messageFor(field: string) {
  return `Error en el campo ${field}, no se encontró o tiene tipo o formato incorrecto`;
}