const { Router } = require("express");
const adminController = require("../controllers/adminController.js");
const visitorAuth = require("../middlewares/visitorAuth.js");

const router = Router();

router.get('/', adminController.index_get);
router.get('/logout', adminController.logout_get);
router.get('/dashboard', visitorAuth.adminAuth, visitorAuth.checkAdmin, adminController.dashboard_get);

// VISITORS
router.get('/visitors', visitorAuth.adminAuth, visitorAuth.checkAdmin, adminController.visitors_get);
router.get('/visitors/records', visitorAuth.adminAuth, visitorAuth.checkAdmin, adminController.visitors_records_get);
router.get('/visitors/trace', visitorAuth.adminAuth, visitorAuth.checkAdmin, adminController.visitors_trace_get);
router.get('/visitors/list', visitorAuth.adminAuth, visitorAuth.checkAdmin, adminController.visitors_list_get);
router.put('/visitors/list/vaccinated/:id', visitorAuth.adminAuth, visitorAuth.checkAdmin, adminController.vaccination_status_put);
// ESTABLISHMENTS
router.get('/establishments/requests', visitorAuth.adminAuth, visitorAuth.checkAdmin, adminController.establishments_requests_get);
router.post('/establishments/requests/:id', visitorAuth.adminAuth, visitorAuth.checkAdmin, adminController.establishments_request_post);
router.get('/establishments/list', visitorAuth.adminAuth, visitorAuth.checkAdmin, adminController.establishments_list_get);


module.exports = router;