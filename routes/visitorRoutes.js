const { Router } = require("express");
const visitorController = require("../Controllers/visitorController.js");
const faceController = require("../Controllers/faceController.js");
const visitorAuth = require("../middlewares/visitorAuth.js");
const upload = require("../middlewares/upload.js");

const router = Router();

router.get('/', visitorController.index_get);

router.route('/register')
    .get(visitorController.register_get)
    .post(visitorController.register_post);

router.get('/register/code/:email', visitorController.register_code_get);

// router.route('/check')
    // .get(visitorAuth.visitorAuth, visitorAuth.checkVisitor, faceController.check_get)
    // .post(visitorAuth.visitorAuth, visitorAuth.checkVisitor, upload.single('check'), faceController.check_post);

router.route('/detect/:process')
    .get(visitorAuth.visitorAuth, visitorAuth.checkVisitor, faceController.detect_get)
    .post(visitorAuth.visitorAuth, visitorAuth.checkVisitor, upload.single('faces'), faceController.detect_post);

router.route('/login')
    .get(visitorController.login_get)
    .post(visitorController.login_post);

router.get('/logout',  visitorController.logout_get);

router.route('/forgot')
    .get(visitorController.forgot_get)
    .put(visitorController.forgot_post);

router.get('/forgot/code/:email', visitorController.forgot_code_get);

router.get('/profile', visitorAuth.visitorAuth, visitorAuth.checkVisitor, visitorController.profile_get);
router.get('/details', visitorAuth.visitorAuth, visitorAuth.checkVisitor, visitorController.details_get);
router.post('/details/change/password/old', visitorAuth.visitorAuth, visitorAuth.checkVisitor, visitorController.oldPassword_post);
router.put('/details/change/password/new', visitorAuth.visitorAuth, visitorAuth.checkVisitor, visitorController.newPassword_put);

module.exports = router;