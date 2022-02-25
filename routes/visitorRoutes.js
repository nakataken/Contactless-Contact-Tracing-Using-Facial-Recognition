const { Router } = require("express");
const controller = require("../controllers/visitorController.js");
const visitorAuth = require("../middlewares/visitorAuth.js");

const router = Router();

router.get('/', controller.index_get);
router.get('/register', controller.register_get);
router.post('/register', controller.register_post);
router.get('/detect', visitorAuth.requireAuth, visitorAuth.checkVisitor, controller.detect_get);
router.post('/detect', controller.detect_post);
router.get('/login', controller.login_get);
router.post('/login',controller.login_post);
router.get('/logout',  controller.logout_get);
router.get('/profile', visitorAuth.requireAuth, visitorAuth.checkVisitor, controller.profile_get);

module.exports = router;