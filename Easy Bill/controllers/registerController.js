const connectDB = require("../config/dbConfig");
const { QueryTypes } = require("sequelize");

const createUser = async (req, res) => {
  // Decision key - 1 - Registration success, 2 - Already registerd, 3 - Missing fields
  try {
    const {
      deviceuniqueid,
      devicename,
      businessname,
      businessaddress,
      loginmobilenumber,
      email,
      gst,
      gstnumber = "",
    } = req.body;

    if (
      !deviceuniqueid &&
      !devicename &&
      !businessname &&
      !businessaddress &&
      !loginmobilenumber &&
      !email &&
      !gst
    ) {
      return res.status(200).json({
        status: false,
        message: "Missing required field!",
        // decisionkey: 3,
        requiredFields:
          "deviceuniqueid,devicename,businessname,businessaddress,loginmobilenumber,email,gst",
        results: [{ decisionkey: 3 }],
      });
    }

    if (gst && !gstnumber) {
      return res.status(200).json({
        status: false,
        message: "Missing required field!",
        // decisionkey: 3,
        requiredFields: "gstnumber missing as gst is set true",
        results: [{ decisionkey: 3 }],
      });
    }

    // Check if user already registered
    const checkalreadyRegisteredQuery = `SELECT * FROM MAS_User_Device_Registration WHERE loginmobilenumber = :loginmobilenumber AND ISACTIVE = true`;

    const checkalreadyRegistered = await connectDB.query(
      checkalreadyRegisteredQuery,
      { replacements: { loginmobilenumber } }
    );

    if (checkalreadyRegistered[0].length > 0) {
      checkalreadyRegistered[0][0].decisionkey = 2
      return res.status(200).json({
        status: false,
        // decisionkey: 2,
        message: "Already registered user!",
        results: checkalreadyRegistered[0]
      });
    }

    const insertNewRegistrationQuery = `INSERT INTO MAS_User_Device_Registration (deviceuniqueid, devicename, businessname, businessaddress, loginmobilenumber, email, gst, gstnumber) VALUES (:deviceuniqueid, :devicename, :businessname, :businessaddress, :loginmobilenumber, :email, :gst, :gstnumber)`;

    await connectDB.query(insertNewRegistrationQuery, {
      replacements: {
        deviceuniqueid,
        devicename,
        businessname,
        businessaddress,
        loginmobilenumber,
        email,
        gst,
        gstnumber,
      },
    });

    const registeredUser = await connectDB.query(checkalreadyRegisteredQuery, {
      replacements: { loginmobilenumber },
    });
   

    registeredUser[0][0].decisionkey = 1;

    return res.status(200).json({
      status: true,
      message: "User registration success!",
      // decisionkey: 1,
      results: registeredUser[0],
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error!", error: err });
  }
};

module.exports = { createUser };
