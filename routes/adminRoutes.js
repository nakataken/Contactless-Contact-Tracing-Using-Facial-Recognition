const { Router } = require("express");
const adminController = require("../controllers/adminController.js");
const visitorAuth = require("../middlewares/visitorAuth.js");

const router = Router();

router.get('/', adminController.index_get);
router.get('/logout', adminController.logout_get);
router.get('/dashboard', visitorAuth.adminAuth, visitorAuth.checkAdmin, adminController.dashboard_get);
router.get('/requests', visitorAuth.adminAuth, visitorAuth.checkAdmin, adminController.requests_get);
router.post('/requests/:id', visitorAuth.adminAuth, visitorAuth.checkAdmin, adminController.request_post);
router.get('/search/:name',  visitorAuth.adminAuth, visitorAuth.checkAdmin, adminController.search_get);

module.exports = router;