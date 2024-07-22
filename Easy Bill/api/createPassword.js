const express = require("express");
const router = express.Router();

const {createPassword} = require("../controllers/createPasswordController.js");

router.post("/", createPassword);

module.exports = router;
