const Category = require("../../model/category_model");
const { fetchAllproducts, getproductbyid, deleteproductbyid } = require("../../model/product")
const Product = require("../../model/product_model_db");
const User = require("../../model/user_model");


//retriving the data from the database
exports.gethomepage=(req,res,next)=>{
    //findall to get all the details (select*frm products)
    //here products means table name or anything but it consist the information about the table
    //includes the other table details
    Product.findAll({include:[{model:Category},{model:User}]}).then((products)=>{
        console.log(products);
        const data={
            pageTitle:"HOME_PAGE",
            products
        }
        res.render('homepage',data) 
    }).catch(err=>{
        console.log(err);
    })
}

//viewdetails
exports.getdetailspage=(req,res,next)=>{
    const productid=req.params.id //fro dynamic routes
    console.log(productid,"productid");
    //pk means primary key
    //find by pk only send the one id into it
    Product.findByPk(productid).then((product)=>{
        const viewdata={
            product,
            pageTitle:"VIEW_DETAILS"
        }
        res.render('productdetails',viewdata)
    }).catch(err=>{
        console.log(err);
    })
}


//edit the product 
exports.edittheproduct=(req,res,next)=>{
    const productid=req.params.id 
    let viewsdata={
        pageTitle:"EDIT_DETAILS",
    }
    Product.findByPk(productid).then((product)=>{
        console.log(product.title,"in eidt");
        viewsdata={...{product}, ... viewsdata}
        return Category.findAll({attributes:['id','title']})  
    }).then(categories=>{
        viewsdata={...{categories},...viewsdata}
        res.render('edit-product',viewsdata)
    }).catch(err=>{
        console.log(err);
    })
    
    //edit the product in single table name
    // const productid=req.params.id 
    // Product.findByPk(productid).then((product)=>{
    //     console.log(product.title,"in eidt");
    //     console.log(product.category.title);
    //     const viewdata={
    //         product,
    //         pageTitle:"EDIT_DETAILS",
    //     }
    //     res.render('edit-product',viewdata)
    // })
}

//editproduct-post
exports.posteditproduct=(req,res,next)=>{
    //while gettimg from the edit product check his id man
    //if we dont check then we will moddagudisi poyi
    const productid=req.body.productId
    console.log(productid);
    const product={
        title:req.body.title,
        image:req.body.imageurl,
        price:req.body.price,
        description:req.body.description  ,
        categoryId: req.body.categoryId
    }
    console.log(product);
    //update is a function it uodates the information
    Product.update(product, {where: {id:productid}}).then(()=>{
        res.redirect('/products')
        console.log("updated");
    }).catch(()=>{
        console.log("err");
    })

}