const Request = require("../models/Request.js");
const { Router } = require("express");
const establishmentController = require("../controllers/establishmentController.js");
const faceController = require("../controllers/faceController.js");
const establishmentAuth = require("../middlewares/establishmentAuth.js");
const upload = require("../middlewares/upload.js");

const router = Router();

router.get('/', establishmentController.index_get);

router.route('/request')
    .get(establishmentController.request_get)
    .post(upload.fields([{name: 'permit', maxCount: 1}, {name: 'validID', maxCount: 1}]), establishmentController.request_post);

router.get('/request/code/:email', establishmentController.request_code_get);

router.route('/login')
    .get(establishmentController.login_get)
    .post(establishmentController.login_post);

router.get('/logout', establishmentController.logout_get);

router.route('/forgot')
    .get(establishmentController.forgot_get)
    .put(establishmentController.forgot_post);

router.get('/forgot/code/:email', establishmentController.forgot_code_get);

router.get('/home', establishmentAuth.requireAuth, establishmentAuth.checkEstablishment, establishmentController.home_get);

router.get('/details', establishmentAuth.requireAuth, establishmentAuth.checkEstablishment, establishmentController.details_get);
router.post('/details/change/password/old', establishmentAuth.requireAuth, establishmentAuth.checkEstablishment, establishmentController.oldPassword_post);
router.put('/details/change/password/new', establishmentAuth.requireAuth, establishmentAuth.checkEstablishment,establishmentController.newPassword_put);

router.get('/dashboard', establishmentAuth.requireAuth, establishmentAuth.checkEstablishment, establishmentController.dashboard_get);

router.route('/qr')
    .get(establishmentAuth.requireAuth, establishmentAuth.checkEstablishment, establishmentController.qr_get)
    .post(establishmentAuth.requireAuth, establishmentAuth.checkEstablishment, establishmentController.qr_post);

router.route('/verify')
    .get(establishmentAuth.requireAuth, establishmentAuth.checkEstablishment, faceController.verification_get)
    .post(establishmentAuth.requireAuth, establishmentAuth.checkEstablishment, upload.single('verify'), faceController.verification_post);

module.exports = router;