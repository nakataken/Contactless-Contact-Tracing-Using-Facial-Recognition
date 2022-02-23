import { Router } from "express";
import controller from "../controllers/visitorController.js";
import visitorAuth from "../middlewares/visitorAuth.js";

const router = Router();

router.get('/visitor/register', controller.register_get);
router.post('/visitor/register', controller.register_post);
router.get('/visitor/detect', visitorAuth.requireAuth, visitorAuth.checkVisitor, controller.detect_get);
router.post('/visitor/detect', controller.detect_post);
router.get('/visitor/login', controller.login_get);
router.post('/visitor/login',controller.login_post);
router.get('/visitor/logout',  controller.logout_get);
router.get('/visitor/profile', visitorAuth.requireAuth, visitorAuth.checkVisitor, controller.profile_get);

export default router;