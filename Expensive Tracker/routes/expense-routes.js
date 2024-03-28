const express=require('express')
const { postexpense, getpostexpense, deleteexpense, setlimit } = require('../controllers/expensive-controller')
const { authenticate } = require('../middleware/middleware')
const { leaderboard, getbasis } = require('../controllers/leaderboard-controller')
const router=express.Router()



router.get('/addexpense',authenticate,getpostexpense)
router.post('/addexpense',authenticate,postexpense)
router.post('/expense/delete',authenticate,deleteexpense)
//leaderboard
router.get('/board',leaderboard)
//basis expense
router.get('/basis',authenticate,getbasis)

// router.post('/set',setlimit)


module.exports=router