const express=require('express')
const { getDetails, postDetails, deleteDetails, editDetails } = require('../controllers/details.controller')

const router=express.Router()


router.get('/',getDetails)
router.post('/post',postDetails)
router.delete('/delete/:id',deleteDetails)
router.put('/edit/:id',editDetails)

module.exports=router

