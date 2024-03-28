require('dotenv').config()
const express=require('express')
const cors=require('cors');
const passport=require("passport");
const authRoute=require('./auth')
const cookieSession=require('cookie-session');
const passportStrategy=require('./passport');

const app=express()

app.use(
    cookieSession({
        name: 'session',
        keys: ['somesessionkey'],
        maxAge:24*60*60*1000 // 24 hours    
    })
)

app.use(passport.initialize())
app.use(passport.session())

app.use('/auth',authRoute)

const port=process.env.PORT || 8080

app.listen(port, ()=>{
    console.log(`Server is running on ${port}`)
})