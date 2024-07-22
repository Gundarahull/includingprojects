const express = require("express");
const {editProfileData, editPassword, getProfileData } = require("../controllers/profileController");
const router = express.Router();

router.post('/editProfile',editProfileData)

router.post('/editPassword',editPassword)

router.post('/getProfile',getProfileData)


module.exports=router