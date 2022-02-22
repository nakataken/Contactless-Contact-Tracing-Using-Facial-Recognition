import { Router } from "express";
import controller from "../controllers/establishmentController.js";

const router = Router();

router.get('/establishment/login', controller.login_get);
router.post('/establishment/login', controller.login_post);
router.post('/establishment/logout', controller.login_post);
router.get('/establishment/dashboard', controller.dashboard_get);

export default router;