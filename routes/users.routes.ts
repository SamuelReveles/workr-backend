import { Router } from "express";
import { testJWT, testRegisterUser, testPasswordValidation, testUUID } from "../controllers/users.controller";

const router: Router = Router();

// TODO: Cambiar endpoints de prueba por endpoints de producción.
router.get("/test_jwt", testJWT);
router.post("/test_register", testRegisterUser);
router.post("/test_password_validation", testPasswordValidation);
router.get("/test_uuid", testUUID);

export default router;