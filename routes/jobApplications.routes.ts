import { Router } from "express";
import { getJobApplicationFormAnswers, getVacancyApplicants, registerApplicant } from "../controllers/jobApplications.controller";
import { formAnswers, register, vacancyApplicants } from "../middlewares/jobApplications";
import { verifyJWT } from "../middlewares/jwtAuth";

const router = Router();

router.post("/register", [ verifyJWT, ...register ], registerApplicant);
router.get("/vacancy_applicants", [ verifyJWT, ...vacancyApplicants ], getVacancyApplicants);
router.get("/form_answers", [ verifyJWT, ...formAnswers ], getJobApplicationFormAnswers);

export default router;