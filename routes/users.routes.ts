import { Router } from "express";
import { registerUser, updateUserProfile, validateLogin } from "../controllers/users.controller";
import { verifyJWT } from "../helpers/jwt";

const router: Router = Router();

router.post("/register", registerUser);
router.post("/login", validateLogin);
router.post("/update_profile", verifyJWT, updateUserProfile);

export default router;