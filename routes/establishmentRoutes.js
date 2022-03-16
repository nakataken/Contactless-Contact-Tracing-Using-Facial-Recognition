const { Router } = require("express");
const establishmentController = require("../controllers/establishmentController.js");
const faceController = require("../controllers/faceController.js");
const establishmentAuth = require("../middlewares/establishmentAuth.js");

const router = Router();

router.get('/', establishmentController.index_get);
router.get('/request', establishmentController.request_get);
router.post('/request', establishmentController.request_post);
router.get('/login', establishmentController.login_get);
router.post('/login', establishmentController.login_post);
router.get('/logout', establishmentController.logout_get);
router.get('/home', establishmentAuth.requireAuth, establishmentAuth.checkEstablishment, establishmentController.home_get);
router.get('/dashboard', establishmentAuth.requireAuth, establishmentAuth.checkEstablishment, establishmentController.dashboard_get);

router.get('/record', establishmentController.record_get);
router.post('/verify', faceController.verification_post);

// router.get('/test', controller.test_get);

module.exports = router;