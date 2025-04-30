import { Router } from "express";
import { login } from "../middlewares/auth";
import { validateLogin } from "../controllers/auth.controller";

const router: Router = Router();

router.post("/login", [ ...login], validateLogin);

export default router;