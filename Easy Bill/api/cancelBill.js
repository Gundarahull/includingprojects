const express = require("express");
const { cancelBillCancel } = require("../controllers/cancelBillController");
const router = express.Router();

router.post('/cancel',cancelBillCancel)

module.exports=router