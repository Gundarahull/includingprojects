const connectDB = require("../config/dbConfig");

const getValidateStatus = async (req, res) => {
  try {
    const { userRole, mobileNumber } = req.body;
    if (!userRole || !mobileNumber) {
      return res.status(400).json({
        status: false,
        message: "Missing required field!",
        requiredFields: "userRole,mobileNumber ",
      });
    }

    if (userRole == "Admin") {
      const checkInRegistrationQuery = `select * from mas_user_device_registration where loginmobilenumber = :mobileNumber and isactive = true`;

      const checkInRegistration = await connectDB.query(
        checkInRegistrationQuery,
        {
          replacements: {
            mobileNumber: mobileNumber,
          },
        }
      );

      const checkInLogin = `select * from Mas_HandleUserCredentials where loginusername = :mobileNumber and isactive = true`;

      const checkInLoginResult = await connectDB.query(checkInLogin, {
        replacements: {
          mobileNumber: mobileNumber,
        },
      });

      if (
        checkInRegistration[0].length == 0 &&
        checkInLoginResult[0].length == 0
      ) {
        return res.status(200).json({
          status: true,
          message: "Mobile number available",
          results: [],
        });
      }
      return res.status(200).json({
        status: false,
        message: "Number is NOt Available",
        results: [],
      });
    }

    if (userRole == "Staff") {
      const checkInLogin = `select * from Mas_HandleUserCredentials where loginusername = :mobileNumber and isactive = true`;
      const checkInLoginResult = await connectDB.query(checkInLogin, {
        replacements: {
          mobileNumber: mobileNumber,
        },
      });
      if (checkInLoginResult[0].length == 0) {
        return res.status(200).json({
          status: "true",
          message: "Number is Available",
          results: [],
        });
      }
      return res.status(200).json({
        status: false,
        message: "Number is NOt Available",
        results: [],
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error!", error: err });
  }
};

module.exports = { getValidateStatus };
