"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newHires = exports.updatedInterviewNotes = exports.interviewNotes = exports.contactedApplicants = exports.interview = exports.formAnswers = exports.vacancyApplicants = exports.register = void 0;
const express_validator_1 = require("express-validator");
const validator_1 = require("./validator");
const customValidators_1 = require("./customValidators");
exports.register = [
    (0, express_validator_1.body)("contactEmail").notEmpty().isString().isEmail().withMessage(messageFor("contactEmail")),
    (0, express_validator_1.body)("phoneNumber").notEmpty().isString().isMobilePhone("any").withMessage(messageFor("phoneNumber")),
    (0, express_validator_1.body)("highestEducationLevel").notEmpty().isString().withMessage(messageFor("highestEducationLevel")),
    (0, express_validator_1.body)("experience").notEmpty().isString().withMessage(messageFor("experience")),
    (0, express_validator_1.body)("hardSkills").notEmpty().isString().withMessage(messageFor("hardSkills")),
    (0, express_validator_1.body)("softSkills").notEmpty().isString().withMessage(messageFor("softSkills")),
    (0, express_validator_1.body)("applicationReason").notEmpty().isString().withMessage(messageFor("applicationReason")),
    (0, express_validator_1.body)("portfolioLink").notEmpty().isString().isURL({
        allow_underscores: true,
    }).withMessage(messageFor("portfolioLink")),
    (0, express_validator_1.body)("vacancyId").notEmpty().isString().withMessage(messageFor("vacancyId")),
    validator_1.validator,
];
exports.vacancyApplicants = [
    (0, express_validator_1.body)("vacancyId").notEmpty().isString().withMessage(messageFor("vacancyId")),
    validator_1.validator,
];
exports.formAnswers = [
    (0, express_validator_1.body)("jobApplicationId").notEmpty().isString().withMessage(messageFor("jobApplicationId")),
    validator_1.validator,
];
exports.interview = [
    (0, express_validator_1.body)("jobApplicationId").notEmpty().isString().withMessage(messageFor("jobApplicationId")),
    validator_1.validator,
];
exports.contactedApplicants = [
    (0, express_validator_1.body)("vacancyId").notEmpty().isString().withMessage(messageFor("vacancyId")),
    validator_1.validator,
];
exports.interviewNotes = [
    (0, express_validator_1.body)("interviewNotesId").notEmpty().isString().withMessage(messageFor("interviewNotesId")),
    validator_1.validator,
];
exports.updatedInterviewNotes = [
    (0, express_validator_1.body)("interviewNotesId").notEmpty().isString().withMessage(messageFor("interviewNotesId")),
    (0, express_validator_1.body)("interviewNotes").notEmpty().isString().withMessage(messageFor("interviewNotes")),
    validator_1.validator,
];
exports.newHires = [
    (0, express_validator_1.body)("position").notEmpty().isString().withMessage(messageFor("position")),
    (0, express_validator_1.body)("newHiresIds").custom(customValidators_1.newHiresValidator),
    validator_1.validator,
];
function messageFor(field) {
    return `Error en el campo ${field}, no se encontró o tiene tipo o formato incorrecto`;
}
//# sourceMappingURL=jobApplications.js.map