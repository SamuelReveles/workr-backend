import { Router } from "express";
import { companyCharts, getCompanyProfile, getProfilePicture, registerCompany, updateCompanyProfile } from "../controllers/companies.controller";
import { register, updateProfile } from "../middlewares/companies";
import { verifyProfilePicture } from "../middlewares/profilePicture";
import { verifyJWT } from "../middlewares/jwtAuth";

const router: Router = Router();

router.post("/register", [verifyProfilePicture, ...register], registerCompany);
router.post("/update_profile", [verifyJWT, verifyProfilePicture, ...updateProfile], updateCompanyProfile);
router.get("/company_charts", [verifyJWT], companyCharts);
router.get("/profile/:companyId", verifyJWT, getCompanyProfile);
router.get("/profile_picture/:id", verifyJWT, getProfilePicture);

export default router;