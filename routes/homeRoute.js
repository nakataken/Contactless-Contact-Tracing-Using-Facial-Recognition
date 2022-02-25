const { Router } = require("express");
const controller = require("../controllers/homeController.js");

const router = Router();

router.get('/', controller.index_get);
router.get('/establishment', controller.establishment_get);
router.get('/visitor', controller.visitor_get);
router.get('/about', controller.about_get);

module.exports = router;
