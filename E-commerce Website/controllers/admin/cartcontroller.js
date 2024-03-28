const Cart = require("../../model/Cart-model");
const { addproducttocart, getcartdata } = require("../../model/cart");
const { getproductbyid, fetchAllproducts } = require("../../model/product");
const Product = require("../../model/product_model_db");
const CartItem = require("../../model/cart-item-model");

exports.viewcart=(req,res,next)=>{
    console.log("into cart");
    req.user.getCart()
    .then((cart)=>{
        return cart.getProducts()
        .then((cartproducts)=>{
            let totalprice=0
            for(let product of cartproducts){
                totalprice += +product.cartitem.quantity * +product.price
            }
            const viewsdata={
                pagetitle:"CART",
                cartproducts,
                totalprice
            }
            res.render('cart-details',viewsdata)
        })
    })

   
    
}

exports.postcartdetails=(req,res,next)=>{
    // console.log(req.body);
    const productid=req.body.productId
    // console.log(productid);
    let newquantity=1
    let fetchedcart
    req.user.getCart().then(cart=>{
        if(!cart){ //for the first time no in the cart
            return req.user.createCart()
        }
        return cart
    }).then(cart=>{
        fetchedcart=cart
        return cart.getProducts({where:{id:productid}})
    }).then((products)=>{
        if(products.length){
            //look at these
            newquantity=products[0].cartitem.quantity+1
            return products[0]
        }
        return Product.findByPk(productid)
    }).then(product=>{
        return fetchedcart.addProduct(product,{through :{quantity:newquantity}})
    }).then(()=>{
        res.redirect('/cart')
    }).catch((err)=>{
        console.log(err);
    })
}


//deletring in cart
exports.poscarttdelete=(req,res,next)=>{
    //for deleteing we want the id
    const productid=req.body.productId
    console.log(productid,"refers to prodct id");
    //we ae using he nody we want id there we have post method thats why  we are using the nody
    //destroy for delete the through the edit
    CartItem.destroy({where:{productId:productid}})
    .then(()=>{
        res.redirect('/products')
        console.log("deleted");
    }).catch((err)=>{
        console.log(err);
    })
}