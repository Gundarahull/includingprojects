const express = require("express");
const router = express.Router();

const { getUnits, getTaxTypes } = require("../controllers/utilitiesController");

router.post("/units", getUnits).post("/taxtypes", getTaxTypes);

module.exports = router;
