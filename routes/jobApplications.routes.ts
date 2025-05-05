import { Router } from "express";
import { getVacancyApplicants, registerApplicant } from "../controllers/jobApplications.controller";
import { register, vacancyApplicants } from "../middlewares/jobApplications";
import { verifyJWT } from "../middlewares/jwtAuth";

const router = Router();

router.post("/register", [ verifyJWT, ...register ], registerApplicant);
router.get("/vacancy_applicants", [ verifyJWT, ...vacancyApplicants ], getVacancyApplicants);

export default router;