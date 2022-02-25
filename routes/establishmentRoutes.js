const { Router } = require("express");
const controller = require("../controllers/establishmentController.js");
const establishmentAuth = require("../middlewares/establishmentAuth.js");

const router = Router();

router.get('/', controller.index_get);
router.get('/request', controller.request_get);
router.post('/request', controller.request_post);
router.get('/login', controller.login_get);
router.post('/login', controller.login_post);
router.get('/logout', controller.logout_get);
router.get('/home', establishmentAuth.requireAuth, establishmentAuth.checkEstablishment, controller.home_get);
router.get('/dashboard', establishmentAuth.requireAuth, establishmentAuth.checkEstablishment, controller.dashboard_get);
router.get('/record', establishmentAuth.requireAuth, establishmentAuth.checkEstablishment, controller.record_get);
router.post('/record', establishmentAuth.requireAuth, establishmentAuth.checkEstablishment, controller.record_post);

router.get('/test', controller.test_get);

module.exports = router;