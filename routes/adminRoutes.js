import { Router } from "express";
import controller from "../controllers/adminController.js";
import adminAuth from "../middlewares/adminAuth.js";

const router = Router();

router.get('/admin', controller.index_get);
router.get('/admin/login', controller.login_get);
router.post('/admin/login', controller.login_post);
router.get('/admin/logout', controller.logout_get);
router.get('/admin/dashboard', adminAuth.requireAuth, adminAuth.checkAdmin, controller.dashboard_get);

router.get('/admin/test', controller.test_get);
export default router;