import { Router } from "express";
import controller from "../controllers/homeController.js";

const router = Router();

router.get('/', controller.index_get);
router.get('/establishment', controller.establishment_get);
router.get('/visitor', controller.visitor_get);
router.get('/about', controller.about_get);

export default router;
