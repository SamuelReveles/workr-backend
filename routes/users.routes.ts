import { Router } from "express";
import { registerUser } from "../controllers/users.controller";

const router: Router = Router();

router.post("/register", registerUser);

export default router;