import { Router } from "express";
import { authenticateUser } from "../controllers/users.controller";

const router: Router = Router();

// TODO: Cambiar a endpoint de producción para autenticación.
router.get("/test_login", authenticateUser);

export default router;