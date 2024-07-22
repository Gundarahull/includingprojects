const express = require("express");
const router = express.Router();

const {login} = require("../controllers/loginController.js");

router.post("/", login);

module.exports = router;
