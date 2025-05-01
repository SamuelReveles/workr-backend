import { Router } from "express";
import { postVacancy } from "../controllers/vacancies.controller";
import { post } from "../middlewares/vacancies";
import { verifyJWT } from "../middlewares/jwtAuth";

const router = Router();

router.post("/post", [ verifyJWT, ...post ], postVacancy);

export default router;