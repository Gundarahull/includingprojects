const Signup = require("../model/Signup-model");
const jwt = require('jsonwebtoken');

const secretKey = 'yourSecretKeyHere';

exports.authenticate = (req, res, next) => { 
    console.log("IN MIDDLE WARE");
    const token = req.cookies.token;
    console.log('Token value:');
    //decrypt the code
    const user=jwt.verify(token,secretKey)
    //getting the token from the cookie
    //nad its id
    console.log("USERID>>>>>",user.userId);
    Signup.findByPk(user.userId).then((user)=>{ 
        
        req.user = user;  //important
        console.log("INTO THE USER ID");
        // console.log(req.user);
        next();
    }).catch(()=>{res.status(401).send({message: 'You are not authorized to perform this action'})});

}
