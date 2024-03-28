const express=require('express')
const router=express.Router()
const path=require('path')
const { getreview, postreview, getpostreview, gettingpostreview } = require('../controllers/company-controller')

router.get('/',getreview)
router.post('/review',postreview)
router.get('/review',getreview)
router.post('/getreview',getpostreview)
// router.get('/getreview',getpostreview)


module.exports=router