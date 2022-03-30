const { Router } = require("express");
const controller = require("../controllers/visitorController.js");
const faceController = require("../controllers/faceController.js");
const visitorAuth = require("../middlewares/visitorAuth.js");
const upload = require("../middlewares/upload.js");

const router = Router();

router.get('/', controller.index_get);

router.route('/register')
    .get(controller.register_get)
    .post(controller.register_post);

router.get('/register/code/:email', controller.register_code_get);

router.route('/forgot')
    .get(controller.forgot_get)
    .put(controller.forgot_post);

router.get('/forgot/code/:email', controller.forgot_code_get);
// router.route('/check')
    // .get(visitorAuth.visitorAuth, visitorAuth.checkVisitor, faceController.check_get)
    // .post(visitorAuth.visitorAuth, visitorAuth.checkVisitor, upload.single('check'), faceController.check_post);

router.route('/detect/:process')
    .get(visitorAuth.visitorAuth, visitorAuth.checkVisitor, faceController.detect_get)
    .post(visitorAuth.visitorAuth, visitorAuth.checkVisitor, upload.single('faces'), faceController.detect_post);


router.route('/login')
    .get(controller.login_get)
    .post(controller.login_post);

router.get('/logout',  controller.logout_get);

router.get('/profile', visitorAuth.visitorAuth, visitorAuth.checkVisitor, controller.profile_get);
router.get('/details', visitorAuth.visitorAuth, visitorAuth.checkVisitor, controller.details_get);
router.post('/details/change/password/old', visitorAuth.visitorAuth, visitorAuth.checkVisitor, controller.oldPassword_post);
router.put('/details/change/password/new', visitorAuth.visitorAuth, visitorAuth.checkVisitor, controller.newPassword_put);


module.exports = router;