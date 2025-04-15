import { Router } from "express";
import { registerCompany, updateCompanyProfile } from "../controllers/companies.controller";
import { register, updateProfile } from "../middlewares/companies";
import { verifyProfilePicture } from "../middlewares/profilePicture";
import { verifyJWT } from "../middlewares/jwtAuth";

const router: Router = Router();

router.post("/register", [ verifyProfilePicture, ...register ], registerCompany);
router.post("/update_profile", [ verifyJWT, verifyProfilePicture, ...updateProfile ], updateCompanyProfile);

export default router;