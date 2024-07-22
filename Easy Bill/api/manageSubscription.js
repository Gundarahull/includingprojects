const express = require("express");
const { getsubscriptionPlans, updateTransactions } = require("../controllers/manageSubscriptionController");
const router = express.Router();

router.get('/',getsubscriptionPlans).post('/',updateTransactions)

module.exports=router

