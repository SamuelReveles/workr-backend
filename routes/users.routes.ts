import { Router } from "express";
import { registerUser, updateUserProfile, validateLogin } from "../controllers/users.controller";
import { login, register, updateProfile } from "../middlewares/users";
import { verifyJWT } from "../middlewares/jwtAuth";
import { verifyProfilePicture } from "../middlewares/profilePicture";

const router: Router = Router();

router.post("/register", [ ...register ], registerUser);
router.post("/login", [ ...login ], validateLogin);
router.post("/update_profile", [ verifyJWT, verifyProfilePicture, ...updateProfile ], updateUserProfile);

export default router;