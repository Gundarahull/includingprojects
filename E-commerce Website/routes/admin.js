const express=require('express')
const router=express.Router() //getting router from the express
const path=require('path')
// const productsdata=require('../util/product')
const productController=require('../controllers/admin/productController')
// const { productspage } = require('../controllers/admin/homecontroller')


// root firectory for substition the dirname
// we are just assign the router into it/\
// router.get('/products',productspage)
router.get('/',productController.adminproucts)

router.get('/add',productController.getAddproduct)

router.post('/add',productController.postAddproduct)

router.post('/delete',productController.postdelete)







module.exports=router //we are exporting the routers