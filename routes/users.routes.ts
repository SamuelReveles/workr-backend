import { Router } from "express";
import { authenticateUser, fetchInfo, pong } from "../controllers/users.controller";

const router: Router = Router();

router.get('/ping', pong);

// TODO: Eliminar endpoint de prueba de BD.
router.get("/user_info", fetchInfo);

// TODO: Cambiar a endpoint de producción para autenticación.
router.get("/test_login", authenticateUser);

export default router;