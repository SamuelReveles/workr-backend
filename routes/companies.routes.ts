import { Router } from "express";
import { registerCompany } from "../controllers/companies.controller";
import { register } from "../middlewares/companies";
import { verifyProfilePicture } from "../middlewares/profilePicture";

const router: Router = Router();

router.post("/register", [ verifyProfilePicture, ...register ], registerCompany);

export default router;