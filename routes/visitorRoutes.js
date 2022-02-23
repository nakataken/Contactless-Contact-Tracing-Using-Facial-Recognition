import { Router } from "express";
import controller from "../controllers/visitorController.js";

const router = Router();

router.get('/visitor/register', controller.register_get);
router.post('/visitor/register', controller.register_post);
router.get('/visitor/detect', controller.detect_get);
router.post('/visitor/detect', controller.detect_post);
router.get('/visitor/login', controller.login_get);
router.post('/visitor/login',controller.login_post);
router.post('/visitor/logout', controller.login_post);
router.get('/visitor/profile', controller.profile_get);

export default router;