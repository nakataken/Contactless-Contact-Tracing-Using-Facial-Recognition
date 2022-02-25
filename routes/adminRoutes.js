const { Router } = require("express");
const controller = require("../controllers/adminController.js");
const adminAuth = require("../middlewares/adminAuth.js");

const router = Router();

router.get('/', controller.index_get);
router.get('/login', controller.login_get);
router.post('/login', controller.login_post);
router.get('/logout', controller.logout_get);
router.get('/dashboard', adminAuth.requireAuth, adminAuth.checkAdmin, controller.dashboard_get);

router.get('/test', controller.test_get);

module.exports = router;