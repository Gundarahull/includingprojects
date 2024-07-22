const express = require("express");
const router = express.Router();

const { createUser } = require('../controllers/registerController');

router.route('/').post(createUser);

module.exports = router;
