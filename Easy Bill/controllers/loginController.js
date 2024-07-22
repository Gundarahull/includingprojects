const connectDB = require("../config/dbConfig");

const login = async (req, res) => {
  try {
    const {
      loginmobilenumber,
      userpassword,
      userrole,
      loggedindeviceid,
      loggedindevicename,
    } = req.body;

    if (
      !loginmobilenumber &&
      !userpassword &&
      !userrole &&
      !loggedindeviceid &&
      !loggedindevicename
    ) {
      return res.status(200).json({
        status: false,
        message: "Missing required field!",
        requiredFields:
          "loginmobilenumber, userpassword, userrole, loggedindeviceid, loggedindevicename",
      });
    }
    // Decision key - 0 - No registration 1 - All good, 2 - No subscription, 3 - Invalid credentials, 4 - Create password, 5 - Subscription expired,  6 - Contact adminstrator

    // const getUserDetailQuery = `SELECT a.*,b.language,c.expiry_date,d.planname,d.screen_access FROM mas_user_device_registration a inner join configuration b on
    // a.userregistrationid=b.userregistrationid
    // inner join manage_user_subscription c on a.userregistrationid=c.userregistrationid
    // inner join mas_subscription_plans d on c.subscriptionid = d.subscription_id
    // WHERE a.loginmobilenumber = :loginmobilenumber AND a.IsActive = true and c.isactive=true and d.isactive= true`;

    if (userrole == "Admin") {
      // Check if user is registerd
      console.log("In the Admin BLOCK");
      const getUserDetailQuery = `SELECT * FROM mas_user_device_registration WHERE loginmobilenumber = :loginmobilenumber AND IsActive = true`;
      const getUserDetail = await connectDB.query(getUserDetailQuery, {
        replacements: { loginmobilenumber },
      });

      console.log("getUserdwtail", getUserDetail[0]);

      if (getUserDetail[0] == 0) {
        return res.status(200).json({
          status: false,
          // decisionkey: 0,
          message:
            "No user registered with this mobile number, please register to continue!",
          requiredFields: "loginmobilenumber, userpassword",
          results: [{ decisionkey: 0 }],
        });
      }

      // implement subscription check
      //\check Expiry Things
      const chkSubQuery = `select * from manage_user_subscription a inner join mas_subscription_plans b on a.subscriptionid = b.subscription_id where userregistrationid = :userregistrationid and a.isactive= true and b.isactive = true`;

      const chkSubDetail = await connectDB.query(chkSubQuery, {
        replacements: {
          userregistrationid: getUserDetail[0][0].userregistrationid,
        },
      });

      if (chkSubDetail[0].length == 0) {
        return res.status(200).json({
          status: false,
          // decisionkey: 0,
          message: "No subscription!",
          results: [
            {
              userregistrationid: getUserDetail[0][0].userregistrationid,
              decisionkey: 2,
            },
          ],
        });
      }

      // Check credentials

      const checkUserCredentialsQuery = `SELECT * FROM Mas_HandleUserCredentials WHERE LoginUserName = :loginmobilenumber AND userrole =:userrole AND IsActive = true`;

      const checkUserCredentials = await connectDB.query(
        checkUserCredentialsQuery,
        {
          replacements: {
            loginmobilenumber,
            userrole: "Admin",
          },
        }
      );

      if (checkUserCredentials[0].length == 0) {
        return res.status(200).json({
          status: false,
          // decisionkey: 0,
          message: "Create password!",
          results: [
            {
              userregistrationid: getUserDetail[0][0].userregistrationid,
              decisionkey: 4,
            },
          ],
        });
      }

      const user = checkUserCredentials[0][0];

      const checkPassword = user.userpassword === userpassword;

      if (!checkPassword) {
        return res.status(200).json({
          status: false,
          message: "Invalid username or password!",
          results: [
            {
              userregistrationid: getUserDetail[0][0].userregistrationid,
              decisionkey: 3,
            },
          ],
        });
      }

      const checkUserConfigQuery = `SELECT * FROM configuration WHERE userregistrationid = :userregistrationid AND IsActive = true`;

      const checkUserConfig = await connectDB.query(checkUserConfigQuery, {
        replacements: {
          userregistrationid: user.userregistrationid,
        },
      });

      console.log("setting lang",checkUserConfig[0][0].language);

      if (checkUserConfig[0].length == 0) {
        return res.status(200).json({
          status: false,
          message: "No cofiguration!",
          results: [
            {
              userregistrationid: getUserDetail[0][0].userregistrationid,
              decisionkey: 8,
            },
          ],
        });
      }

      const checkIfUserAlreadyLoggedQuery = `SELECT * FROM ManageUserLogin WHERE UserCredentialsId = :UserCredentialsId AND IsActive = true`;

      const checkIfUserAlreadyLogged = await connectDB.query(
        checkIfUserAlreadyLoggedQuery,
        {
          replacements: {
            UserCredentialsId: user.usercredentialsid,
            loggedindeviceid,
          },
        }
      );

      // Not an active logged in user.
      if (checkIfUserAlreadyLogged[0].length == 0) {
        const userInfo = {
          userregistrationid: user.userregistrationid,
          usercredentialsid: user.usercredentialsid,
          loginusername: user.loginusername,
          userrole: user.userrole,
          username: user.username,
          businessname: getUserDetail[0][0].businessname,
          email: getUserDetail[0][0].email,
          gst: getUserDetail[0][0].gst,
          gstnumber: getUserDetail[0][0].gstnumber,
          productlanguage: checkUserConfig[0][0].language,
          loggedindeviceid: loggedindeviceid,
          loggedindevicename: loggedindevicename,
          expirydate: chkSubDetail[0][0].expiry_date,
          subscriptionplan: chkSubDetail[0][0].planname,
          screenaccess: chkSubDetail[0][0].screen_access.split(","),
          settimeinterval:checkUserConfig[0][0].settimeinterval,
          decisionkey: 1,
        };
        const insertUserLoginQuery = `INSERT INTO ManageUserLogin (UserCredentialsId, loggedindeviceid, loggedindevicename) VALUES (:UserCredentialsId, :loggedindeviceid, :loggedindevicename)`;

        await connectDB.query(insertUserLoginQuery, {
          replacements: {
            UserCredentialsId: user.usercredentialsid,
            loggedindeviceid,
            loggedindevicename,
          },
        });

        return res.status(200).json({
          status: true,
          message: "User found!",
          // decisionkey: 1,
          results: [userInfo],
        });
      }
      

      // Actively logged
      if (checkIfUserAlreadyLogged[0].length > 0) {
        // Check if he is logging in again with same logged in device - Login success
        const checkIfSameUserLogging = checkIfUserAlreadyLogged[0].filter(
          (itm) => itm.loggedindeviceid == loggedindeviceid
        );

        const userInfo = {
          userregistrationid: user.userregistrationid,
          usercredentialsid: user.usercredentialsid,
          loginusername: user.loginusername,
          userrole: user.userrole,
          username: user.username,
          businessname: getUserDetail[0][0].businessname,
          email: getUserDetail[0][0].email,
          gst: getUserDetail[0][0].gst,
          gstnumber: getUserDetail[0][0].gstnumber,
          loggedindeviceid: checkIfUserAlreadyLogged[0][0].loggedindeviceid,
          loggedindevicename: checkIfUserAlreadyLogged[0][0].loggedindevicename,
          productlanguage: checkUserConfig[0][0].language,
          expirydate: chkSubDetail[0][0].expiry_date,
          subscriptionplan: chkSubDetail[0][0].planname,
          screenaccess: chkSubDetail[0][0].screen_access.split(","),
          settimeinterval:checkUserConfig[0][0].settimeinterval,
          decisionkey: 1,
        };
        console.log("UserINFO>>>>>>>>>>>>>>>>>>>",userInfo[0]);
        if (checkIfSameUserLogging.length > 0) {
          return res.status(200).json({
            status: true,
            message: "User found!",
            // decisionkey: 1,
            results: [userInfo],
          });
        }

        // Differnt device. Advice user to logout from all active devices - Login failure
        const checkIfLoggedInOtherDevice = checkIfUserAlreadyLogged[0].filter(
          (itm) => itm.loggedindeviceid != loggedindeviceid
        );
        if (checkIfLoggedInOtherDevice.length > 0) {
          return res.status(200).json({
            status: true,
            message: `Already logged in, please logout from device - ${checkIfUserAlreadyLogged[0][0].loggedindevicename} to continue!`,
            results: [
              {
                userregistrationid: user.userregistrationid,
                usercredentialsid: user.usercredentialsid,
                decisionkey: 6,
              },
            ],
          });
        }
      }
    }

    if (userrole == "Staff") {
      const checkUserCredentialsQuery = `SELECT * FROM Mas_HandleUserCredentials WHERE LoginUserName = :loginmobilenumber AND userrole =:userrole AND IsActive = true;`;

      const checkUserCredentials = await connectDB.query(
        checkUserCredentialsQuery,
        {
          replacements: {
            loginmobilenumber,
            userrole: "Staff",
            // userregistrationid: userregistrationid,
          },
        }
      );

      if (checkUserCredentials[0].length == 0) {
        return res.status(200).json({
          status: false,
          // decisionkey: 0,
          message:
            "Please Check the Login mobile Number or Registration Doesn't exist",
          results: [{ decisionkey: 3 }],
        });
      }

      const user = checkUserCredentials[0][0];

      //Check SUb
      const chkSubQuery = `select * from manage_user_subscription a inner join mas_subscription_plans b on a.subscriptionid = b.subscription_id where userregistrationid = :userregistrationid and a.isactive= true and b.isactive = true`;

      const chkSubDetail = await connectDB.query(chkSubQuery, {
        replacements: { userregistrationid: user.userregistrationid },
      });

      if (chkSubDetail[0].length == 0) {
        return res.status(200).json({
          status: false,
          // decisionkey: 0,
          message: "No subscription!",
          results: [
            { userregistrationid: user.userregistrationid, decisionkey: 2 },
          ],
        });
      }

      const checkPassword = user.userpassword === userpassword;
      if (!checkPassword) {
        return res.status(200).json({
          status: false,
          message: "Invalid credentials !",
          results: [
            { userregistrationid: user.userregistrationid, decisionkey: 3 },
          ],
        });
      }

      const checkUserConfigQuery = `SELECT * FROM configuration WHERE userregistrationid = :userregistrationid AND IsActive = true`;

      const checkUserConfig = await connectDB.query(checkUserConfigQuery, {
        replacements: {
          userregistrationid: user.userregistrationid,
        },
      });
      console.log("CHECK LANG",checkUserConfig[0]);
      if (checkUserConfig[0].length == 0) {
        return res.status(200).json({
          status: false,
          message: "No cofiguration!",
          results: [
            { userregistrationid: user.userregistrationid, decisionkey: 8 },
          ],
        });
      }

      //After we have to see it
      const getUserDetailQuery = `SELECT * FROM mas_user_device_registration WHERE userregistrationid = :userregistrationid AND IsActive = true`;
      const getUserDetail = await connectDB.query(getUserDetailQuery, {
        replacements: { userregistrationid: user.userregistrationid },
      });

      console.log("userDetaill in staff", getUserDetail[0]);

      if (!getUserDetail[0][0]) {
        return res.status(200).json({
          status: false,
          message: "No registration found!",
          results: [{ decisionkey: 0 }],
        });
      }

      const checkIfUserAlreadyLoggedQuery = `SELECT * FROM ManageUserLogin WHERE UserCredentialsId = :UserCredentialsId AND IsActive = true`;

      const checkIfUserAlreadyLogged = await connectDB.query(
        checkIfUserAlreadyLoggedQuery,
        {
          replacements: {
            UserCredentialsId: user.usercredentialsid,
            loggedindeviceid,
          },
        }
      );

      // Not an active logged in user.
      if (checkIfUserAlreadyLogged[0].length == 0) {
        const userInfo = {
          userregistrationid: user.userregistrationid,
          usercredentialsid: user.usercredentialsid,
          loginusername: user.loginusername,
          userrole: user.userrole,
          username: user.use,
          businessname: getUserDetail[0][0].businessname,
          email: getUserDetail[0][0].email,
          gst: getUserDetail[0][0].gst,
          gstnumber: getUserDetail[0][0].gstnumber,
          loggedindeviceid: loggedindeviceid,
          loggedindevicename: loggedindevicename,
          productlanguage: checkUserConfig[0][0].language,
          expirydate: chkSubDetail[0][0].expiry_date,
          subscriptionplan: chkSubDetail[0][0].planname,
          screenaccess: chkSubDetail[0][0].screen_access.split(","),
          expirydate: getUserDetail[0][0].expirydate,
          planname: getUserDetail[0][0].planname,
          decisionkey: 1,
        };

        const insertUserLoginQuery = `INSERT INTO ManageUserLogin (UserCredentialsId, loggedindeviceid, loggedindevicename) VALUES (:UserCredentialsId, :loggedindeviceid, :loggedindevicename)`;

        await connectDB.query(insertUserLoginQuery, {
          replacements: {
            UserCredentialsId: user.usercredentialsid,
            loggedindeviceid,
            loggedindevicename,
          },
        });

        return res.status(200).json({
          status: true,
          message: "User found!",
          // decisionkey: 1,
          results: [userInfo],
        });
      }

      // Actively logged
      if (checkIfUserAlreadyLogged[0].length > 0) {
        // Check if he is logging in again with same logged in device - Login success
        const checkIfSameUserLogging = checkIfUserAlreadyLogged[0].filter(
          (itm) => itm.loggedindeviceid == loggedindeviceid
        );

        const userInfo = {
          userregistrationid: user.userregistrationid,
          usercredentialsid: user.usercredentialsid,
          loginusername: user.loginusername,
          userrole: user.userrole,
          username: user.username,
          businessname: getUserDetail[0][0].businessname,
          email: getUserDetail[0][0].email,
          gst: getUserDetail[0][0].gst,
          gstnumber: getUserDetail[0][0].gstnumber,
          loggedindeviceid: checkIfUserAlreadyLogged[0][0].loggedindeviceid,
          loggedindevicename: checkIfUserAlreadyLogged[0][0].loggedindevicename,
          decisionkey: 1,
          productlanguage: checkUserConfig[0][0].language,
          expirydate: chkSubDetail[0][0].expiry_date,
          subscriptionplan: chkSubDetail[0][0].planname,
          screenaccess: chkSubDetail[0][0].screen_access.split(","),
          expirydate: getUserDetail[0][0].expirydate,
          planname: getUserDetail[0][0].planname,
        };
        if (checkIfSameUserLogging.length > 0) {
          return res.status(200).json({
            status: true,
            message: "User found!",
            // decisionkey: 1,
            results: [userInfo],
          });
        }

        // Differnt device. Advice user to logout from all active devices - Login failure
        const checkIfLoggedInOtherDevice = checkIfUserAlreadyLogged[0].filter(
          (itm) => itm.loggedindeviceid != loggedindeviceid
        );
        if (checkIfLoggedInOtherDevice.length > 0) {
          return res.status(200).json({
            status: true,
            message: `Already logged in, please logout from device - ${checkIfUserAlreadyLogged[0][0].loggedindevicename} to continue!`,
            results: [
              {
                userregistrationid: user.userregistrationid,
                usercredentialsid: user.usercredentialsid,
                decisionkey: 6,
              },
            ],
          });
        }
      }
    }
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Internal server error!", error: err });
  }
};

module.exports = { login };
