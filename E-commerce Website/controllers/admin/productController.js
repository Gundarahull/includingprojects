// const productsdata=require('/Users/Windows 10/Pictures/Sharpen/BACK_END/REVISON/U_TUBE/util/product')
// const productsdata=require('../../util/product')

const { render } = require("ejs");
const { saveProduct, deleteproductbyid } = require("../../model/product");
const { fetchAllproducts, getproductbyid } = require("../../model/product");
const Product = require("../../model/product_model_db");
const Category = require("../../model/category_model");
const User = require("../../model/user_model");

//admin-products
exports.adminproucts=(req,res,next)=>{
    Product.findAll({include:[{model:Category},{model:User}]}).then(products=>{
        const data={
            pagetitle:"ADMIN-PRODUCTS",
            products
        }
        res.render('adminproducts',data)
    })
}

exports.getAddproduct=(req,res,next)=>{
    Category.findAll({attributes:['id','title']})
    //attributes only for the perseved thinsg
    .then(categories=>{
        console.log(categories);
        const addproduct={
            pagetitle:"ADD_PRODUCT",
            categories
        }
        res.render('Addproduct',addproduct) 
    }).catch(err=>{
        console.log(err);
    })
    
}

//inserting into the database
exports.postAddproduct=(req,res,next)=>{
    //here arrange the details into one pack
    const product={
        title:req.body.title,
        description:req.body.description,
        price:req.body.price,
        imgageurl:req.body.imageurl,
        categoryId:req.body.categoryId
    }
    req.user.createProduct(product).then(()=>{
        console.log("inserted SUCCESFULLy");
        res.redirect('/')
    }).catch((err)=>{
        console.log(err);
    })

}

//for deleting the product
exports.postdelete=(req,res,next)=>{
    //for deleteing we want the id
    const productid=req.body.productId
    //we ae using he nody we want id there we have post method thats why  we are using the nody

    //destroy for delete the through the edit
    Product.destroy({where:{id:productid}})
    .then(()=>{
        res.redirect('/products')
        console.log("deleted");
    }).catch((err)=>{
        console.log(err);
    })
}

