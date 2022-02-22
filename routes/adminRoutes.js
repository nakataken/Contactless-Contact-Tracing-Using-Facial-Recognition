import { Router } from "express";
import controller from "../controllers/adminController.js";

const router = Router();

router.get('/admin', controller.index_get);
router.get('/admin/login', controller.login_get);
router.post('/admin/login', controller.login_post);
router.post('/admin/logout', controller.login_post);
router.get('/admin/dashboard', controller.dashboard_get);

export default router;