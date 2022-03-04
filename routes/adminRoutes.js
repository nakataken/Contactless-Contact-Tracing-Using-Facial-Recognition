const { Router } = require("express");
const controller = require("../controllers/adminController.js");
const visitorAuth = require("../middlewares/visitorAuth.js");

const router = Router();

router.get('/', controller.index_get);
router.get('/logout', controller.logout_get);
router.get('/dashboard', visitorAuth.requireAuth, visitorAuth.checkAdmin, controller.dashboard_get);

module.exports = router;