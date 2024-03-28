const express=require('express')

const router=express.Router()

const path=require('path') //to gibe the location for the files while sending the files as a response

//importing data from the file
// const productsData=require('../util/product')
const { getAllproducts } = require('../model/product')
const { gethomepage,getdetailspage, productspage, edittheproduct, posteditproduct } = require('../controllers/admin/homecontroller')
const { postcartdetails, viewgetcartdetails, viewcart, poscarttdelete } = require('../controllers/admin/cartcontroller')
const { postAddproduct } = require('../controllers/admin/productController')
// root firectory for substition the dirname



router.get('/',gethomepage)

router.get('/products/details/:id',getdetailspage)

router.get('/product/edit/:id',edittheproduct)


// router.get('/edit',postAddproduct)
router.post('/edit',posteditproduct)

// router.post('/edit',productController.postAddproduct)

router.post('/cart',postcartdetails)
router.get('/cart',viewcart)

router.post('/cart/delete',poscarttdelete)

module.exports=router