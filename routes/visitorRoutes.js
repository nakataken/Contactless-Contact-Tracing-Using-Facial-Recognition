const { Router } = require("express");
const controller = require("../controllers/visitorController.js");
const faceController = require("../controllers/faceController.js");

const visitorAuth = require("../middlewares/visitorAuth.js");

const router = Router();

router.get('/', controller.index_get);
router.route('/register')
    .get(controller.register_get)
    .post(controller.register_post);

router.get('/detect/1',faceController.detect1_get);
router.post('/detect/1', faceController.detect1_post);

router.route('/detect/2')
    .get(faceController.detect2_get)
    .post(faceController.detect2_post);

router.route('/detect/3')
    .get(faceController.detect3_get)
    .post(faceController.detect3_post);

router.route('/login')
    .get(controller.login_get)
    .post(controller.login_post);

router.get('/logout',  controller.logout_get);
router.get('/profile', visitorAuth.requireAuth, visitorAuth.checkVisitor, controller.profile_get);

module.exports = router;