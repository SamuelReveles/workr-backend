import { Router, Request, Response } from "express";
import { registerUser, updateUserProfile, validateLogin } from "../controllers/users.controller";
import { login, register } from "../middlewares/users";
import { verifyJWT } from "../helpers/jwt";

const router: Router = Router();

router.post("/register", [ ...register ], registerUser);
router.post("/login", [ ...login ], validateLogin);
router.post("/update_profile", verifyJWT, updateUserProfile);

export default router;