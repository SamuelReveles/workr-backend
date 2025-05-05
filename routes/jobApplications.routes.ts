import { Router } from "express";
import { registerApplicant } from "../controllers/jobApplications.controller";
import { register } from "../middlewares/jobApplications";
import { verifyJWT } from "../middlewares/jwtAuth";

const router = Router();

router.post("/register", [ verifyJWT, ...register ], registerApplicant);

export default router;