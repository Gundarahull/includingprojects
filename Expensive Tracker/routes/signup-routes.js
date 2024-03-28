const express=require('express')
const router=express.Router()
const path=require('path')
const { getsingup, postsignup, getlogin, postlogin, getexpensivesubmit, forgetpassword, resetpassword, getupdatepassword, postupdatepassword } = require('../controllers/signup-controller')
const { authenticate } = require('../middleware/middleware')

router.get('/',getsingup)
router.post('/signup',postsignup)
//login
router.get('/login',getlogin)
router.post('/login',postlogin)
//forget password
router.get('/forgetpassword',forgetpassword)
router.post("/forgetpassword",resetpassword)

//updating the routes
router.get('/resetpassword/',getupdatepassword)
router.post('/updatepassword',postupdatepassword)

//expense
router.get('/expensive',getexpensivesubmit)


module.exports=router