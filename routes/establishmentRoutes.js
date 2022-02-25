const { Router } = require("express");
const controller = require("../controllers/establishmentController.js");
const establishmentAuth = require("../middlewares/establishmentAuth.js");

const router = Router();

router.get('/establishment/login', controller.login_get);
router.post('/establishment/login', controller.login_post);
router.get('/establishment/logout', controller.logout_get);
router.get('/establishment/home', establishmentAuth.requireAuth, establishmentAuth.checkEstablishment, controller.home_get);
router.get('/establishment/dashboard', establishmentAuth.requireAuth, establishmentAuth.checkEstablishment, controller.dashboard_get);
router.get('/establishment/record', establishmentAuth.requireAuth, establishmentAuth.checkEstablishment, controller.record_get);
router.post('/establishment/record', establishmentAuth.requireAuth, establishmentAuth.checkEstablishment, controller.record_post);

router.get('/establishment/test', controller.test_get);

module.exports = router;