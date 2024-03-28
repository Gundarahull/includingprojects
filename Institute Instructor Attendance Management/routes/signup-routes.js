const express=require('express');
const { getsignuppage, postsignup, get, showid, getid, postlogingetid, loginpage, gethomepage } = require('../controller/signup-controller');
const { getreport, logout, getdailyreport } = require('../controller/report-controller');
const { authenticate } = require('../middleware/middleware');
const router=express.Router()

router.get('/',getsignuppage)
router.post('/signup',postsignup)

router.get('/showid',showid)
router.post('/getid',getid)
router.get('/login',loginpage)
router.post('/login',postlogingetid)

//into-site
router.get('/home',authenticate,gethomepage)
router.get('/monthreport',authenticate,getreport)

router.get('/dailyreport',authenticate,getdailyreport)

//logout
router.get('/logout',authenticate,logout)


module.exports = router; 