const connectDb = require("../config/dbConfig");

const editProfileData = async (req, res) => {
  const {
    usercredentialsid,
    userregistrationid,
    businessname,
    businessaddress,
    businessmobile,
    businessemail,
    gstnumber,
    loggedindeviceid,
    loggedindevicename,
  } = req.body;

  try {
    if (!userregistrationid || !usercredentialsid) {
      return res.status(400).json({
        status: false,
        message: "Missing required field!",
        requiredFields: "userregistrationid,usercredentailsid",
      });
    }

    const checkUserCredentialsQuery = `SELECT * FROM Mas_HandleUserCredentials WHERE usercredentialsid = :usercredentialsid AND userregistrationid=:userregistrationid and IsActive = true`;

    const checkUserCredentials = await connectDb.query(
      checkUserCredentialsQuery,
      {
        replacements: {
          usercredentialsid,
          userregistrationid,
        },
      }
    );

    if (checkUserCredentials[0].length == 0) {
      return res.status(400).json({
        status: false,
        message: "Not a valid user!",
        requiredFields: "Not a valid user id",
      });
    }

    const user = checkUserCredentials[0][0];
    console.log("user", user);
    if (checkUserCredentials[0][0].userrole === "Admin") {
      const editAdminProfile = `update mas_user_device_registration 
        set 
            businessname= :businessname, 
            businessaddress = :businessaddress,
            loginmobilenumber = :businessmobile,
            email = :email
        WHERE 
            UserRegistrationId = :userregistrationid and isactive= true;
            `;
      await connectDb.query(editAdminProfile, {
        replacements: {
          userregistrationid,
          businessname: businessname,
          businessaddress: businessaddress,
          email: businessemail,
          businessmobile: businessmobile,
        },
      });
    }

    const getUserDetailQuery = `SELECT * FROM mas_user_device_registration WHERE UserRegistrationId = :userregistrationid AND IsActive = true`;
    const getUserDetail = await connectDb.query(getUserDetailQuery, {
      replacements: {
        userregistrationid,
      },
    });
    console.log("getuserDetail", getUserDetail[0]);

    if (gstnumber && getUserDetail[0][0].gst) {
      const userInfo = {
        userregistrationid: user.userregistrationid,
        usercredentialsid: user.usercredentialsid,
        loginmobilenumber: user.loginusername,
        userrole: user.userrole,
        businessname: getUserDetail[0][0].businessname,
        businessaddress: getUserDetail[0][0].businessaddress,
        email: getUserDetail[0][0].email,
        gst: getUserDetail[0][0].gst,
        gstnumber: getUserDetail[0][0].gstnumber,
        productlanguage: getUserDetail[0][0].productlanguage,
        loggedindeviceid: loggedindeviceid,
        loggedindevicename: loggedindevicename,
        decisionkey: 1,
      };
      return res.status(200).json({
        status: false,
        message:
          "GST eidt is not allowed! and Profile data is Sucessfully Updated",
        results: [userInfo],
      });
    } else {
      console.log("gstnumber",gstnumber);
      const createGSTQuery = `
                      UPDATE mas_user_device_registration 
                      SET gst = true, gstnumber = :gstnumber 
                      WHERE UserRegistrationId = :userregistrationid AND IsActive = true
`;
      await connectDb.query(createGSTQuery, {
        replacements: {
          gstnumber: gstnumber, // Ensure gstnumber is defined and passed correctly
          userregistrationid: userregistrationid, // Ensure userregistrationid is defined and passed correctly
        },
      });
      getUserDetail[0][0].gst = true;
      getUserDetail[0][0].gstnumber = gstnumber;
    }

    //Some Confusion IN hERE
    const userInfo = {
      userregistrationid: user.userregistrationid,
      usercredentialsid: user.usercredentialsid,
      loginmobilenumber: user.loginusername,
      userrole: user.userrole,
      businessname: getUserDetail[0][0].businessname,
      businessaddress: getUserDetail[0][0].businessaddress,
      email: getUserDetail[0][0].email,
      gst: getUserDetail[0][0].gst,
      gstnumber: getUserDetail[0][0].gstnumber,
      productlanguage: getUserDetail[0][0].productlanguage,
      loggedindeviceid: loggedindeviceid,
      loggedindevicename: loggedindevicename,
      decisionkey: 1,
    };
    return res.status(200).json({
      status: true,
      message: "Admin profile edited!",
      // decisionkey: 1,
      results: [userInfo],
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};

const editPassword = async (req, res) => {
  const { usercredentialsid, newpassword } = req.body;
  try {
    if (!usercredentialsid || !newpassword) {
      return res.status(400).json({
        status: false,
        message: "Missing required field!",
        requiredFields: "usercredentialsid or newpassword",
      });
    }
    const updateQueryPassword = `update mas_handleusercredentials set userpassword= :newpassword where usercredentialsid = :usercredentialsid and isactive=true`;
    await connectDb.query(updateQueryPassword, {
      replacements: {
        usercredentialsid,
        newpassword,
      },
    });
    return res.status(200).json({
      status: true,
      message: "Password Updated Successfully",
      results: [],
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};

const getProfileData = async (req, res) => {
  const { usercredentialsid, userregistrationid } = req.body;
  try {
    if (!userregistrationid || !usercredentialsid) {
      return res.status(400).json({
        status: false,
        message: "Missing required field!",
        requiredFields: "userregistrationid,usercredentailsid",
      });
    }
    const checkStatusQuey = `select userrole from mas_handleusercredentials where userregistrationid = :userregistrationid and usercredentialsid=:usercredentialsid and isactive =true `;
    const checkStatusResult = await connectDb.query(checkStatusQuey, {
      replacements: {
        userregistrationid,
        usercredentialsid,
      },
    });

    console.log("checking Status", checkStatusResult[0][0]);
    if (checkStatusResult[0][0].userrole === "Admin") {
      const getAdminProfilequery = `SELECT businessname,businessaddress,loginmobilenumber,gst,gstnumber,email FROM mas_user_device_registration WHERE userregistrationid = :userregistrationid and isactive =true`;
      const result = await connectDb.query(getAdminProfilequery, {
        replacements: {
          userregistrationid,
        },
      });
      console.log("admin profile Details", result[0]);
      return res.status(200).json({
        status: true,
        message: "Admin Profile Data Fetched Sucessfully",
        results: [
          {
            businessname: result[0][0].businessname,
            businessaddress: result[0][0].businessaddress,
            gst: result[0][0].gst,
            gstnumber: result[0][0].gstnumber,
            loginmobilenumber: result[0][0].loginmobilenumber,
            email: result[0][0].email,
          },
        ],
      });
    }
    if (checkStatusResult[0][0].userrole === "Staff") {
      const getStaffProfilequery = `SELECT loginusername,fullname FROM mas_handleusercredentials where usercredentialsid=:usercredentialsid and isactive=true`;
      const staffresult = await connectDb.query(getStaffProfilequery, {
        replacements: {
          usercredentialsid,
        },
      });
      return res.status(200).json({
        status: true,
        message: "Staff Profile Data Fetched Sucessfully",
        results: staffresult[0],
      });
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  editProfileData,
  editPassword,
  getProfileData,
};
