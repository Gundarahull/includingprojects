const express=require('express')
const db = require('./database/db')
const app=express()
const cors=require('cors')
require('dotenv').config()

app.use(cors())

//Parsing
app.use(express.json())
app.use(express.urlencoded(true))

const detailRoutes=require('../backend/routes/details.routes')
app.use(detailRoutes)

app.get('/details',async(req,res)=>{
    res.send("Hello World")
})


app.listen(process.env.PORT,()=>{
    console.log("Server is Started");
})