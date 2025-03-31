import { Router } from "express";
import { pong } from "../controllers/users.controller";

const router: Router = Router();

router.get('/ping', pong);

export default router;