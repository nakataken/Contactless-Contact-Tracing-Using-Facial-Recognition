const { Router } = require("express");
const adminController = require("../controllers/adminController.js");
const visitorAuth = require("../middlewares/visitorAuth.js");

const router = Router();

router.get('/', adminController.index_get);
router.get('/logout', adminController.logout_get);
router.get('/dashboard', visitorAuth.adminAuth, visitorAuth.checkAdmin, adminController.dashboard_get);

// RECORDS
router.get('/records', visitorAuth.adminAuth, visitorAuth.checkAdmin, adminController.records_get);
router.get('/records/logs', visitorAuth.adminAuth, visitorAuth.checkAdmin, adminController.records_log_get);
router.post('/records/visitors/filter', visitorAuth.adminAuth, visitorAuth.checkAdmin, adminController.records_visitors_filter_post);
router.post('/records/establishments/filter', visitorAuth.adminAuth, visitorAuth.checkAdmin, adminController.records_establishments_filter_post);
router.get('/records/trace/:id', visitorAuth.adminAuth, visitorAuth.checkAdmin, adminController.records_trace_get);

// VISITORS
router.get('/visitors', visitorAuth.adminAuth, visitorAuth.checkAdmin, adminController.visitors_get);
router.get('/visitors/list', visitorAuth.adminAuth, visitorAuth.checkAdmin, adminController.visitors_list_get);
router.put('/visitors/list/vaccinated/:id', visitorAuth.adminAuth, visitorAuth.checkAdmin, adminController.visitors_vaccination_status_put);

// ESTABLISHMENTS
router.get('/establishments', visitorAuth.adminAuth, visitorAuth.checkAdmin, adminController.establishments_get);
router.get('/establishments/requests', visitorAuth.adminAuth, visitorAuth.checkAdmin, adminController.establishments_requests_get);
router.post('/establishments/requests/:id', visitorAuth.adminAuth, visitorAuth.checkAdmin, adminController.establishments_request_post);
router.get('/establishments/list', visitorAuth.adminAuth, visitorAuth.checkAdmin, adminController.establishments_list_get);


module.exports = router;