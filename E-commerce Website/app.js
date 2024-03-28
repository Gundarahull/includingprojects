const express=require('express') //importing the express
const app=express() //will listen  the all eexpress modules
const bodyParser = require('body-parser') //cpnverts the request and response in json ibject
const path =require('path')


//importing database
const sequelize=require('./util/database')
const { Sequelize } = require('sequelize')


//templating engine
app.set('view engine','ejs')
app.set('views')//folder name


//for the statuc files we aiisgn before the routes
app.use(express.static(path.join(__dirname,'public')))
app.use(bodyParser.urlencoded({ extended:false})) //using bodyparser with the express and converting the url into josn object

//before entering into 
//we check the user
app.use((req,res,next)=>{
    User.findByPk(1).then((user)=>{
        req.user=user
        next()
    })
})


//importing the routes
const adminroutes=require('./routes/admin')
const homeroutes=require('./routes/home')
const categoryroutes=require('./routes/category-routes')
const Category = require('./model/category_model')
const Product = require('./model/product_model_db')
const User = require('./model/user_model')
const Cart = require('./model/Cart-model')
const CartItem = require('./model/cart-item-model')
// const product = require('./model/product_model_db')

app.use('/products',adminroutes)
app.use(homeroutes)
app.use('/categories',categoryroutes)


app.use((req,res)=>{
    const viewdata={
        pageTitle:'ERROR'
    }
    res.render('404',viewdata)
})

///associations
Category.hasMany(Product)

User.hasMany(Category)
Category.belongsTo(User)
User.hasMany(Product)
Product.belongsTo(User)

Product.belongsTo(Category)

User.hasOne(Cart)
Cart.belongsTo(User)

Product.belongsToMany(Cart,{through:CartItem})
Cart.belongsToMany(Product,{through:CartItem})

//1st association between 
// category-product

//2nd association
//user-category
//user-product

//3rd association
// user-Cart
//product-cart-cartitem

sequelize.authenticate().then(()=>{
    console.log("CONNECTION DONE");
}).catch(err=>{
    console.log("err");
})

//only for the table product we use productname.sync()

//for many tables we can use sequilize.
//{force:true} to deleted the data in the tanles
sequelize.sync().then((result)=>{
    return User.findByPk(1)
    console.log("CREATED TABLE");
}).then(user=>{
    if(!user){
        User.create({
            name:'RAHUl',
            email:'rahulrabiya@gmail.com'
        })
    }

}).catch(err=>{
    console.log(err);
})

app.listen(8888,()=>{
    console.log("Server STARTED");
})

