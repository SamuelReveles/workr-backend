import { Router } from "express";
import { getCompanyVacancies, getVacancyDetails, postVacancy, searchVacancy } from "../controllers/vacancies.controller";
import { post, search } from "../middlewares/vacancies";
import { verifyJWT } from "../middlewares/jwtAuth";

const router = Router();

router.post("/post", [ verifyJWT, ...post ], postVacancy);
router.get("/company_vacancies", [ verifyJWT ], getCompanyVacancies);
router.get("/search_vacancy", [ verifyJWT, ...search ], searchVacancy);
router.get("/details/:vacancyId", [ verifyJWT ], getVacancyDetails);

export default router;