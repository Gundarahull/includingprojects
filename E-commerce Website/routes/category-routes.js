const express=require('express')
const { getcategorypage, getaddcategory, postaddcategory } = require('../controllers/admin/categorycontroller')
const router=express.Router() 


router.get('/',getcategorypage)

router.get('/add',getaddcategory)

router.post('/add',postaddcategory)


module.exports=router