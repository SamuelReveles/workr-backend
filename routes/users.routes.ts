import { Router } from "express";
import { registerUser, validateLogin } from "../controllers/users.controller";

const router: Router = Router();

router.post("/register", registerUser);
router.post("/login", validateLogin);

export default router;