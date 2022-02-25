const { Router } = require("express");
const controller = require("../controllers/visitorController.js");
const visitorAuth = require("../middlewares/visitorAuth.js");

const router = Router();

router.get('/visitor/register', controller.register_get);
router.post('/visitor/register', controller.register_post);
router.get('/visitor/detect', visitorAuth.requireAuth, visitorAuth.checkVisitor, controller.detect_get);
router.post('/visitor/detect', controller.detect_post);
router.get('/visitor/login', controller.login_get);
router.post('/visitor/login',controller.login_post);
router.get('/visitor/logout',  controller.logout_get);
router.get('/visitor/profile', visitorAuth.requireAuth, visitorAuth.checkVisitor, controller.profile_get);

module.exports = router;