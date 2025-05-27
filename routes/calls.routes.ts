import { Router } from "express";
import { verifyJWT } from "../middlewares/jwtAuth";
import { generateEmployeeCallAccessToken, getEmployeeCompanyCallDirectory, getUsersInCompanyCall } from "../controllers/calls.controller";

const router = Router();

router.get("/access_token", [ verifyJWT ], generateEmployeeCallAccessToken);
router.get("/company_call_directory", [ verifyJWT ], getEmployeeCompanyCallDirectory);
router.get("/users_in_call", [ verifyJWT ], getUsersInCompanyCall);

export default router;