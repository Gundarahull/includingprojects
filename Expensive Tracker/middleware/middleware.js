
const jwt = require('jsonwebtoken');

const SignUp = require('../model/singup-model');

const secretKey = 'yourSecretKeyHere';


exports.authenticate = (req, res, next) => { 
    console.log("IN MIDDLE WARE");
    const token = req.cookies.token;
    console.log('Token value:', token);
    //decrypt the code
    const user=jwt.verify(token,secretKey)
    //getting the token from the cookie
    //nad its id
    console.log("USERID>>>>>",user.userId);
    //particular id>>Expenses

    //finding the person who is login from the SIGNUP TABLE By using id
    SignUp.findByPk(user.userId).then((user)=>{ 
        //getting the ID through it
        req.user = user;  //important
        console.log("INTO THE USER ID");
        // console.log(req.user);
        next();
    }).catch(()=>{res.status(401).send({message: 'You are not authorized to perform this action'})});
}


exports.setlimit= (req, res, next) => { 
    const limit=req.body.set
    next();
}




