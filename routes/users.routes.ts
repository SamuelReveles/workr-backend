import { Router, Request, Response } from "express";
import { registerUser, validateLogin } from "../controllers/users.controller";
import { login, register } from "../middlewares/users";

const router: Router = Router();

router.post("/register", [ ...register ], registerUser);
router.post("/login", [ ...login ], validateLogin);

export default router;