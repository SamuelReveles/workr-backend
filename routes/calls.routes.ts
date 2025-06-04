import { Router } from "express";
import { verifyJWT } from "../middlewares/jwtAuth";
import { generateEmployeeCallAccessToken, getEmployeeCompanyCallDirectory, getUsersInCompanyCall } from "../controllers/calls.controller";
import { validateCallRequestContext } from "../middlewares/callsContextValidation";

const router = Router();

router.use(verifyJWT);
router.use(validateCallRequestContext);

router.get("/access_token", generateEmployeeCallAccessToken);
router.get("/company_call_directory", getEmployeeCompanyCallDirectory);
router.get("/users_in_call", getUsersInCompanyCall);

export default router;