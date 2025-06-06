import { Router } from "express";
import { companyCharts, createPaymentIntent, employeesCharts, getCompanyPayInfo, getCompanyProfile, getProfilePicture, registerCompany, updateCompanyProfile } from "../controllers/companies.controller";
import { register, updateProfile } from "../middlewares/companies";
import { verifyProfilePicture } from "../middlewares/profilePicture";
import { verifyJWT } from "../middlewares/jwtAuth";

const router: Router = Router();

router.post("/register", [verifyProfilePicture, ...register], registerCompany);
router.post("/update_profile", [verifyJWT, verifyProfilePicture, ...updateProfile], updateCompanyProfile);
router.post("/create_payment_intent", [verifyJWT], createPaymentIntent);
router.get("/company_charts", [verifyJWT], companyCharts);
router.get("/employees_charts", [verifyJWT], employeesCharts);
router.get("/company_pay_info", [verifyJWT], getCompanyPayInfo);
router.get("/profile/:companyId", verifyJWT, getCompanyProfile);
router.get("/profile_picture/:id", verifyJWT, getProfilePicture); 

export default router;