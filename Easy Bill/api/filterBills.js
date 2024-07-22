const express = require("express");
const { filterBills } = require("../controllers/filterBillsController");
const router = express.Router();

router.post('/',filterBills)

module.exports = router;