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

router.get('/register/code/:email', controller.code_get);

router.route('/check')
    .get(visitorAuth.visitorAuth, visitorAuth.checkVisitor, faceController.check_get)
    .post(visitorAuth.visitorAuth, visitorAuth.checkVisitor, upload.single('check'), faceController.check_post);
    
router.route('/detect/1')
    .get(visitorAuth.visitorAuth, visitorAuth.checkVisitor, faceController.detect1_get)
    .post(visitorAuth.visitorAuth, visitorAuth.checkVisitor, upload.single('faces'), faceController.detect1_post);

router.route('/detect/2')
    .get(visitorAuth.visitorAuth, visitorAuth.checkVisitor, faceController.detect2_get)
    .post(visitorAuth.visitorAuth, visitorAuth.checkVisitor, upload.single('faces'), faceController.detect2_post);

router.route('/detect/3')
    .get(visitorAuth.visitorAuth, visitorAuth.checkVisitor, faceController.detect3_get)
    .post(visitorAuth.visitorAuth, visitorAuth.checkVisitor, upload.single('faces'), faceController.detect3_post);

router.route('/login')
    .get(controller.login_get)
    .post(controller.login_post);

router.get('/logout',  controller.logout_get);
router.get('/profile', visitorAuth.visitorAuth, visitorAuth.checkVisitor, controller.profile_get);

module.exports = router;