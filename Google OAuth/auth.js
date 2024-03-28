const router=require( 'express').Router();
const passport= require('passport');

router.get('/login/success',(req,res)=>{
    if(req.user){
        res.status(200).json({
            error:false,
            message:"SUCCESFULLY SIGNED IN",
            user:req.user  //to store in the database
        })
    }else{
        res.status(403).json({error:true,message:'NOT AUTHORIZED'})
    }
})

router.get("/login/failed",(req,res)=>{
    res.status(401).json({
        error:true,
        message:" FAILES",
    })
})

router.get('/google', passport.authenticate('google', {scope:['profile','email']}));


router.get('/google/callback', passport.authenticate('google', {
    successRedirect: process.env.CLIENT_URL, // URL to redirect upon successful authentication
    failureRedirect: '/login/failed' // URL to redirect upon failed authentication
}));


router.get('/logout',(req,res)=>{
    req.logout(),
    res.redirect(process.env.CLIENT_URL)
})

module.exports=router;
