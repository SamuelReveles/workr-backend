import { Router } from "express";
import { getCompanyVacancies, postVacancy } from "../controllers/vacancies.controller";
import { post } from "../middlewares/vacancies";
import { verifyJWT } from "../middlewares/jwtAuth";

const router = Router();

router.post("/post", [ verifyJWT, ...post ], postVacancy);
router.get("/company_vacancies", [ verifyJWT ], getCompanyVacancies);

export default router;