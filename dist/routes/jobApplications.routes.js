"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jobApplications_controller_1 = require("../controllers/jobApplications.controller");
const jobApplications_1 = require("../middlewares/jobApplications");
const jwtAuth_1 = require("../middlewares/jwtAuth");
const router = (0, express_1.Router)();
router.post("/register", [jwtAuth_1.verifyJWT, ...jobApplications_1.register], jobApplications_controller_1.registerApplicant);
router.get("/vacancy_applicants", [jwtAuth_1.verifyJWT, ...jobApplications_1.vacancyApplicants], jobApplications_controller_1.getVacancyApplicants);
router.get("/form_answers", [jwtAuth_1.verifyJWT, ...jobApplications_1.formAnswers], jobApplications_controller_1.getJobApplicationFormAnswers);
router.post("/register_interview", [jwtAuth_1.verifyJWT, ...jobApplications_1.interview], jobApplications_controller_1.registerInterview);
router.get("/contacted_vacancy_applicants", [jwtAuth_1.verifyJWT, ...jobApplications_1.contactedApplicants], jobApplications_controller_1.getContactedVacancyApplicants);
router.get("/interview_notes", [jwtAuth_1.verifyJWT, ...jobApplications_1.interviewNotes], jobApplications_controller_1.getInterviewNotes);
router.post("/update_interview_notes", [jwtAuth_1.verifyJWT, ...jobApplications_1.updatedInterviewNotes], jobApplications_controller_1.updateInterviewNotes);
router.post("/new_hires", [jwtAuth_1.verifyJWT, ...jobApplications_1.newHires], jobApplications_controller_1.registerNewHires);
exports.default = router;
//# sourceMappingURL=jobApplications.routes.js.map