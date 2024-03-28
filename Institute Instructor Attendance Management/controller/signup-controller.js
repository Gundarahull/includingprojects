
const bcrypt = require('bcrypt');
const Signup = require('../model/Signup-model');
const jwt = require('jsonwebtoken');
const Logs = require('../model/log_details_model');
const secretKey = 'yourSecretKeyHere';

exports.getsignuppage= (req, res, next) => {
    res.render('signup')
}

exports.postsignup = (req, res, next) => {
    const username = req.body.username;
    const useremail = req.body.useremail;  
    // Retrieve userId from the cookie
    const userid = 'R24'+ req.cookies.lastGeneratedID; 
    const password = req.body.password;
    console.log(userid);
    console.log("done");
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            console.log("Error in hashing");
        }
        Signup.create({
            userId: userid,
            username: username,
            password: hash,
            email: useremail,
        }).then((result) => {
            console.log("USER CREATED SUCCESSFULLY");
            res.redirect('/showid')
        }).catch(err => {
            console.log(err);
        });
    });
}

exports.showid= (req, res, next) => {  
        res.render('showid')
}

exports.getid= (req, res, next) => {
    const useremail=req.body.useremail
    Signup.findOne({where:{email:useremail}})
    .then(result=>{
        console.log(result.userId);
        const userId=result.userId
        const viewdata={
            result,
            userId:userId
        }
        res.render('getid',viewdata)
    }).catch(err=>{
        console.log("err");
        res.render('nomail')
    })
}

let token
exports.postlogingetid= (req, res, next) => {
    const  userid=req.body.instructorId
    const password=req.body.password
    const loginTime=req.body.loginTime
    const loginDate=req.body.loginDate
    const loginMonth=req.body.loginMonth
    const loginYear=req.body.loginYear
    console.log(loginDate,loginMonth,loginTime,loginYear);
    Signup.findOne({
        where:{userId:userid}
    }).then(user=>{
        console.log("userid>>>><<<<>><><<>",user.id);
        if(!user){
            return res.status(401).json({message:"Invalid UserID"})
        }
        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                console.log(err);
                console.log("hashing dhobindhi");
            }
            if (result) {
                console.log("Congratulations, login successful!");
                console.log("result",result);
                Logs.create({
                    logintime:loginTime,
                    logouttime:'null',
                    date:loginDate,
                    month:loginMonth,
                    year:loginYear,
                    signupId:user.id
                }).then(result=>{
                    console.log("succesfully installed date");
                    res.redirect('/home')
                }).catch(err=>{
                    console.log(err);
                    console.log("Error in inserting date");
                })

                token = jwt.sign({
                    userId: user.id
                }, secretKey, {
                    expiresIn: '24h'
                });
                console.log("TOKEN DONE");
                res.cookie('token', token, {
                    maxAge: 24 * 60 * 60 * 1000, // Cookie expires in 24 hours
                    httpOnly: true // Cookie is accessible only by the server
                });
                
            } else {
                // Passwords do not match
                console.log("password donot match");
                res.render('passwordnotmatch')
            }
        });
    }).catch(err=>{
        res.render('noinstructor')
    })

}

exports.gethomepage= (req, res, next) => {
    res.render('home')
}

exports.loginpage= (req, res, next) => {
    res.render('login')
}