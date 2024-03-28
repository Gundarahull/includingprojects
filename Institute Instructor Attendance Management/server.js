const express=require('express')
const app=express()
//body-parser
const bodyparser=require('body-parser')
app.use(bodyparser.urlencoded({ extended:false}))
//cookies
const cookieParser = require('cookie-parser');
const sequelize = require('./util/database');
const Signup = require('./model/Signup-model');
app.use(cookieParser())
//for views
app.set('view engine', 'ejs');
app.set('views')
  
//for routes
const instructassign=require('./routes/signup-routes');
const Logs = require('./model/log_details_model');
app.use(instructassign)

//associations
Signup.hasMany(Logs)
Logs.belongsTo(Signup)


sequelize.authenticate().then(()=>{
    console.log("CONNECTION DONE");
}).catch((err)=>{
    console.log(err);
})


sequelize.sync()
.then((result)=>{
    console.log("CREATED TABLE");
}).catch(err=>{
    console.log(err);
})

app.listen(8000,()=>{
    console.log("Server Started");
})