import { Router } from "express";
import { checkoutWorkSession, getNotifications, getProfilePicture, getUserProfile, quitJob, registerUser, updateUserProfile } from "../controllers/users.controller";
import { register, updateProfile, workSession } from "../middlewares/users";
import { verifyJWT } from "../middlewares/jwtAuth";
import { verifyProfilePicture } from "../middlewares/profilePicture";

const router: Router = Router();

router.post("/register", [ ...register ], registerUser);
router.post("/update_profile", [ verifyJWT, verifyProfilePicture, ...updateProfile ], updateUserProfile);
router.get("/profile/:userId", verifyJWT, getUserProfile);
router.get("/profile_picture/:id", verifyJWT, getProfilePicture);
router.get("/notifications", [verifyJWT], getNotifications);
router.post("/quit_job", [verifyJWT], quitJob);
router.post("/checkout_work_session", [verifyJWT, ...workSession], checkoutWorkSession);

export default router;