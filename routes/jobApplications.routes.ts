import { Router } from "express";
import { getContactedVacancyApplicants, getInterviewNotes, getJobApplicationFormAnswers, getVacancyApplicants, registerApplicant, registerInterview } from "../controllers/jobApplications.controller";
import { contactedApplicants, formAnswers, interview, interviewNotes, register, vacancyApplicants } from "../middlewares/jobApplications";
import { verifyJWT } from "../middlewares/jwtAuth";

const router = Router();

router.post("/register", [ verifyJWT, ...register ], registerApplicant);
router.get("/vacancy_applicants", [ verifyJWT, ...vacancyApplicants ], getVacancyApplicants);
router.get("/form_answers", [ verifyJWT, ...formAnswers ], getJobApplicationFormAnswers);
router.post("/register_interview", [ verifyJWT, ...interview ], registerInterview);
router.get("/contacted_vacancy_applicants", [ verifyJWT, ...contactedApplicants], getContactedVacancyApplicants);
router.get("/interview_notes", [ verifyJWT, ...interviewNotes ], getInterviewNotes);

export default router;