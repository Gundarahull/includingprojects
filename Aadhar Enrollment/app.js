const express=require('express')
const app=express()
const bodyparser=require('body-parser')
const sequelize = require('./Util/database')
const Enroll = require('./Models/Enrollement-Model')
app.use(bodyparser.urlencoded({ extended:false}))


app.set('view engine','ejs')
app.set('views')

//settingup routes
const enrollroutes=require('./Routes/Enroll-Route')
app.use(enrollroutes)


//checking COnnection is doen or not by authenticate
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

//setting port number to 1105
app.listen(1105,()=>{
    console.log("Server Started");
})