const express = require("express");
const { dayEndReport, billReport, paymentMode, updatePaymentmode } = require("../controllers/billReportController");
const router = express.Router();

router.post('/',dayEndReport)
router.post('/report',billReport)
router.post("/paymentmode",paymentMode)
router.post("/updatepaymentmode",updatePaymentmode);


module.exports = router;