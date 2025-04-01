import { Router } from "express";
import { fetchInfo, pong } from "../controllers/users.controller";

const router: Router = Router();

router.get('/ping', pong);
router.get("/user_info", fetchInfo);

export default router;