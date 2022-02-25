const { Router } = require("express");
const controller = require("../controllers/adminController.js");
const adminAuth = require("../middlewares/adminAuth.js");

const router = Router();

router.get('/admin', controller.index_get);
router.get('/admin/login', controller.login_get);
router.post('/admin/login', controller.login_post);
router.get('/admin/logout', controller.logout_get);
router.get('/admin/dashboard', adminAuth.requireAuth, adminAuth.checkAdmin, controller.dashboard_get);

router.get('/admin/test', controller.test_get);

module.exports = router;