import { Router } from "express";
import { getJobApplicationFormAnswers, getVacancyApplicants, registerApplicant, registerInterview } from "../controllers/jobApplications.controller";
import { formAnswers, interview, register, vacancyApplicants } from "../middlewares/jobApplications";
import { verifyJWT } from "../middlewares/jwtAuth";

const router = Router();

router.post("/register", [ verifyJWT, ...register ], registerApplicant);
router.get("/vacancy_applicants", [ verifyJWT, ...vacancyApplicants ], getVacancyApplicants);
router.get("/form_answers", [ verifyJWT, ...formAnswers ], getJobApplicationFormAnswers);
router.post("/register_interview", [ verifyJWT, ...interview ], registerInterview);

export default router;