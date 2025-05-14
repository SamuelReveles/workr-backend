import { Router } from "express";
import { getNotifications, getProfilePicture, getUserProfile, registerUser, updateUserProfile } from "../controllers/users.controller";
import { register, updateProfile } from "../middlewares/users";
import { verifyJWT } from "../middlewares/jwtAuth";
import { verifyProfilePicture } from "../middlewares/profilePicture";

const router: Router = Router();

router.post("/register", [ ...register ], registerUser);
router.post("/update_profile", [ verifyJWT, verifyProfilePicture, ...updateProfile ], updateUserProfile);
router.get("/profile/:userId", verifyJWT, getUserProfile);
router.get("/profile_picture/:id", verifyJWT, getProfilePicture);
router.get("/notifications", [verifyJWT], getNotifications);

export default router;