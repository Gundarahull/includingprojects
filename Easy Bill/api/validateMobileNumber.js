const express = require("express");
const router = express.Router();

const { getValidateStatus} = require("../controllers/validateMobileNumberController");

router.post("/", getValidateStatus);

module.exports = router;
