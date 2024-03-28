const express = require('express')
const Razorpay = require('razorpay')
const { createorder, simple, isordercomplete, failedtrans } = require('../controllers/razorpay-controller')
const { authenticate } = require('../middleware/middleware')
const router = express.Router()



router.post('/order',authenticate,createorder)
router.post('/is-order-complete',authenticate,isordercomplete)
router.post('/payment-failed',authenticate,failedtrans)

module.exports = router