const multer = require("multer");
const Request = require("../models/Request.js");
const { Router } = require("express");
const establishmentController = require("../controllers/establishmentController.js");
const faceController = require("../controllers/faceController.js");
const establishmentAuth = require("../middlewares/establishmentAuth.js");

const router = Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let dir = './public/uploads/' + file.fieldname;
        cb(null, dir);
    },

    filename: (request, file, cb) => {
        cb(null, Date.now() + file.originalname);
    },
});

const upload = multer({
    storage: storage,
    limits: {
        fieldSize: 1024 * 1024 * 5,
    },
});

router.get('/', establishmentController.index_get);
router.get('/request', establishmentController.request_get);
router.post('/request', upload.fields([{name: 'permit', maxCount: 1}, {name: 'validID', maxCount: 1}]), establishmentController.request_post);
router.get('/login', establishmentController.login_get);
router.post('/login', establishmentController.login_post);
router.get('/logout', establishmentController.logout_get);
router.get('/home', establishmentAuth.requireAuth, establishmentAuth.checkEstablishment, establishmentController.home_get);
router.get('/dashboard', establishmentAuth.requireAuth, establishmentAuth.checkEstablishment, establishmentController.dashboard_get);

router.get('/record', establishmentController.record_get);
router.post('/verify', faceController.verification_post);

// router.get('/test', controller.test_get);

module.exports = router;