const express=require('express') 
const app=express() 
const bodyParser = require('body-parser') 
const path =require('path')
const Company = require('./model/company-model')

const sequelize=require('./util/database')


app.set('view engine','ejs')
app.set('views')

app.use(bodyParser.urlencoded({ extended:false}))

const companyroutes=require('./routes/company-routes')


app.use(companyroutes)

sequelize.authenticate().then(()=>{
    console.log("CONNECTION DONE");
}).catch((err)=>{
    console.log(err);
})

sequelize.sync()
.then((result)=>{
    console.log("CRETED TABLE");
}).catch(err=>{
    console.log(err);
})

app.listen(1905,()=>{
    console.log("SERVER STARTED");
})