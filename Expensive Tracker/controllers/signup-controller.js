// const SignUp = require("../model/singup-model")
// //for encrpt the password
// const bcrypt = require('bcrypt');

// const jwt = require('jsonwebtoken');

// const secretKey = 'yourSecretKeyHere';

// exports.getsingup = (req, res, next) => {
//     res.render('signup')
// }


// exports.postsignup = (req, res, next) => {

//     const username = req.body.username;
//     const email = req.body.email;
//     const password = req.body.password;

//     const getemail = req.body.email
//     //hashing the password
//     bcrypt.hash(password, 10, (err, hash) => {
//         if (err) {
//             console.log(err);
//             return res.status(500).send("Error occurred while hashing the password");
//         }
//         SignUp.findAll(({ where: { email: getemail } }))
//             .then((users) => {
//                 const userEmails = users.map(user => user.email);
//                 if (userEmails.length > 0) {
//                     res.render('already-exist')
//                 } else {
//                     SignUp.create({
//                         username: username,
//                         email: email,
//                         password: hash // Store the hashed password
//                     })
//                         .then(() => {
//                             console.log("User created successfully.");
//                             res.redirect('/');
//                         })
//                         .catch(err => {
//                             console.log(err);
//                         })
//                 }

//             });
//     })
// }

// exports.getlogin = (req, res, next) => {
//     res.render('log-in')
// }

// exports.getexpensivesubmit = (req, res, next) => {
//     res.render('../views/Expensive/expensive.ejs')
// }

// let token;
// exports.postlogin = (req, res, next) => {
//     const userEmail = req.body.email
//     const password = req.body.password
//     SignUp.findOne({
//         where:
//         {
//             email: userEmail
//         }
//     })
//         .then((user) => {
//             if (user) {
//                 console.log(user.email);
//                 bcrypt.compare(password, user.password, (err, result) => {
//                     if (err) {
//                         console.log(err);
//                     }
//                     if (result) {
//                         console.log("Comgrats");
//                         //this id refers to user
//                         console.log("userID>>>>", user.id);
//                         //encrpt the id with token
//                         token = jwt.sign({
//                             userId: user.id
//                         }, secretKey, {
//                             expiresIn: '24h' // Token expires in 1 hour
//                         });
//                         console.log("token>>>>>", token)
//                         // res.setHeader('Authorization', `Bearer ${token}`);
//                         res.cookie('token', token, {
//                             maxAge: 24 * 60 * 60 * 1000, // Cookie expires in 24 hours
//                             httpOnly: true // Cookie is accessible only by the server
//                         });

//                         // res.redirect('/expensive')

//                         //checking the user is premium or not
//                         SignUp.findOne({where:
//                             {ispremium:true,
//                                 id:user.id
//                             }})
//                         .then((data)=>{
//                             if(data=== null){
//                                 res.redirect('/expensive')    
//                             }
//                             else{
//                                 res.render('../views/premium/ur-premium')
//                             }

//                         }).catch(()=>{
//                             console.log("not inyo the premium");
//                         })
//                     }
//                     else {
//                         res.render('../views/login/password')
//                     };
//                 })
//             } else {

//                 res.render('../views/login/no-email')
//             }
//         }).catch((err) => {
//             console.log(err)
//         });
// }

// exports.getToken = () => {
//     return token;
// };

const SignUp = require("../model/singup-model");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secretKey = process.env.TOKEN

//package for the forget password
const nodemailer = require('nodemailer');
const Forget = require("../model/forgot-model");
//sending mails
const transporter = nodemailer.createTransport({
    // Transport configuration
    service: 'gmail',
    auth: {
        user: process.env.MAIL,
        pass: process.env.MAIL_KEY
    }
});

exports.getsingup = (req, res, next) => {
    res.render('signup');
};

exports.postsignup = async (req, res, next) => {
    const { username, email, password } = req.body;

    try {
        const hash = await bcrypt.hash(password, 10);

        const users = await SignUp.findAll({ where: { email: email } });
        const userEmails = users.map(user => user.email);

        if (userEmails.length > 0) {
            return res.render('already-exist');
        } else {
            await SignUp.create({
                username: username,
                email: email,
                password: hash
            });
            console.log("User created successfully.");
            res.redirect('/');
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send("Error occurred while creating user.");
    }
};

exports.getlogin = (req, res, next) => {
    res.render('log-in');
};

exports.getexpensivesubmit = (req, res, next) => {
    res.render('../views/Expensive/expensive.ejs');
};

exports.postlogin = async (req, res, next) => {
    const userEmail = req.body.email;
    const password = req.body.password;

    try {
        const user = await SignUp.findOne({ where: { email: userEmail } });

        if (!user) {
            return res.render('../views/login/no-email');
        }

        const result = await bcrypt.compare(password, user.password);
        if (result) {
            console.log("Congratulations");

            const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn: '24h' });

            res.cookie('token', token, {
                maxAge: 24 * 60 * 60 * 1000,
                httpOnly: true
            });

            const data = await SignUp.findOne({ where: { ispremium: true, id: user.id } });

            if (!data) {
                res.redirect('/expensive');
            } else {
                res.render('../views/premium/ur-premium');
            }
        } else {
            res.render('../views/login/password');
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send("Error occurred while logging in.");
    }
};

// exports.getToken = () => {
//     return token;
// };




//forget password
exports.forgetpassword = (req, res, next) => {
    res.render('../views/login/forgetpassword')
}
const { v4: uuidv4 } = require('uuid');
const { where } = require("sequelize");
const { _logFunc } = require("nodemailer/lib/shared");

const count = []

exports.resetpassword = (req, res, next) => {
    console.log("into the password");
    const userid = req.body.email
    console.log(userid);
    const uuid = uuidv4();

    SignUp.findOne({ where: { email: userid } }).then((user) => {
        if (!user) {
            console.log("user not found")
            res.render('../views/login/usernotfound')
        } else {
            console.log("USER ID FOR FORGOT>>>", user.id);

            count.push(user.id)
            console.log("COUNT OF ARRAY------", count);
            const countOfOnes = count.filter(num => num === user.id).length;
            if (countOfOnes > 1) {
                console.log("into the after the count");
                Forget.update(
                    { isactive: true,uuid:uuid}, // Updated values for isactive and id
                    { where: { userid: user.id } } // Condition for the update
                )
                    .then((result) => {
                        // After the update, you can proceed with sending the email
                        console.log("AFTER UPDATE");
                        const currentTime = new Date().getTime();
                        // Set the expiry time to 1 minute from the current time
                        const expiryTime = new Date(currentTime + 120000);
                        const url = `${uuid}&expiry=${expiryTime.getTime()}`;
                        const mailOptions = {
                            //manam dhentho aithe authorize ayithamo adhay send chesthundhi
                            from: "shaikrahul731@gmail.com",
                            to: req.body.email,
                            subject: 'UPDATE THE PASSWORD',
                            html: `To update the password, just click on the following link --link will be expire in 2 minutes: <a href="http://localhost:1864/resetpassword/?url=${url}">http://localhost:1864/resetpassword/?url=${url}</a>`
                         
                        };
                        transporter.sendMail(mailOptions, function (error, info) {
                            if (error) {
                                console.log("error");
                            } else {
                                console.log('Email sent: ');
                                res.render('../views/login/mailsent')
                            }
                        });
                        console.log(result); // Result will contain the number of rows affected
                    })
                    .catch(err => {
                        console.log("Error:", err); // Log any errors that occur during the update
                    });
            } else {
                Forget.create({
                    uuid: uuid,
                    userid: user.id,
                    isactive: true, // Assuming 'isactive' is a boolean field
                }).then((result) => {
                    // const url = uuid
                    console.log(result);
                    const currentTime = new Date().getTime();
                    // Set the expiry time to 1 minute from the current time
                    const expiryTime = new Date(currentTime + 120000); // 60000 milliseconds = 1 minute

                    const url = `${uuid}&expiry=${expiryTime.getTime()}`;
                    const mailOptions = {
                        //manam dhentho aithe authorize ayithamo adhay send chesthundhi
                        from: "shaikrahul731@gmail.com",
                        to: req.body.email,
                        subject: 'UPDATE THE PASSWORD',
                        html: `To update the password, just click on the following link --link will be expire in 2 minutes: <a href="http://localhost:1864/resetpassword/?url=${url}">http://localhost:1864/resetpassword/?url=${url}</a>`
                       
                    };
                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            console.log("error");
                        } else {
                            console.log('Email sent: in first time ');
                            res.render('../views/login/mailsent')
                        }
                    });
                    // Add email sending logic here
                }).catch(err => {
                    console.log("Error:", err);
                });
            }

        }
    })

}




exports.getupdatepassword = (req, res, next) => {
    const params = req.query.url
    console.log(params);
    const viewdata = {
        params
    }
    res.render('../views/login/update', viewdata)
}

exports.postupdatepassword = (req, res, next) => {
    const update = req.body.update;
    const params = req.body.params;

    Forget.findOne({ where: { uuid: params } })
        .then(result => {
            if (!result) {
                console.log("Forget record not found for UUID:", params);
                return res.status(404).send("Forget record not found.");
            }

            if (!result.isactive) {
                console.log("Forget record is already inactive for UUID:", params);
                return res.status(400).send("Forget record is already inactive.");
            }

            // Update isactive flag to false to disable the link after one use
            Forget.update({ isactive: false }, { where: { uuid: params } })
                .then(() => {
                    bcrypt.hash(update, 10, (err, hash) => {
                        if (err) {
                            console.log(err);
                            return res.status(500).send("Error occurred while hashing the password");
                        }
                        SignUp.update({ password: hash }, { where: { id: result.userid } })
                            .then(() => {
                                console.log("Password updated successfully!");
                                res.redirect('/login');
                            })
                            .catch(err => {
                                console.log("Error updating password:", err);
                                res.status(500).send("Error updating password.");
                            });
                    });
                })
                .catch(err => {
                    console.log("Error updating Forget record:", err);
                    res.status(500).send("Error updating Forget record.");
                });
        })
        .catch(err => {
            console.log("Error finding Forget record:", err);
            res.status(500).send("Error finding Forget record.");
        });
}

// exports.postupdatepassword = (req, res, next) => {
//     const update = req.body.update
//     const params = req.body.params
//     console.log(update);
//     console.log(params);
//     Forget.update({ isactive: true }, { where: { uuid: params } })
//         .then((result) => {
//             console.log(
//                 "resuklt>>>>>",result);
//         }).catch(err => {
//             console.log(err);
//         })
//     Forget.findOne({ where: { uuid: params } })
//         .then(result => {
//             bcrypt.hash(update, 10, (err, hash) => {
//                 if (err) {
//                     console.log(err);
//                     return res.status(500).send("Error occurred while hashing the password");
//                 }
//                 SignUp.update({ password: hash }, { where: { id: result.userid } })
//                     .then(() => {
//                         console.log("succesfully updated");
//                     }).catch(err => {
//                         console.log("FUCKING OUT MAN");
//                     })
//             }) 
//         }).catch(err => {
//             console.log("COME AND SEE IN THE FORGOT FIND ONE");
//         })
//     res.redirect('/login')
// }






//expiry for the email after sometime.....
// const expirationTimeInMinutes = 1; // Adjust the expiration time as needed (e.g., 60 minutes)

// // Calculate expiration time
// const now = new Date();
// const expirationTime = new Date(now.getTime() + expirationTimeInMinutes * 60000); // Convert minutes to milliseconds

// // Generate URL with expiration timestamp
// const url = `http://localhost:1864/resetpassword/${url}?expires=${expirationTime.getTime()}`;


