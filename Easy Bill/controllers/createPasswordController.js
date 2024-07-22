const connectDB = require("../config/dbConfig");

const createPassword = async (req, res) => {
  const { userregistrationid, userpassword } = req.body;

  if (!userregistrationid && !userpassword) {
    return res.status(200).json({
      status: false,
      message: "Missing required field!",
      requiredFields: "userregistrationid, userpassword",
    });
  }

  const getUserDetailQuery = `SELECT * FROM mas_user_device_registration WHERE userregistrationid = :userregistrationid AND IsActive = true`;

  const getUserDetail = await connectDB.query(getUserDetailQuery, {
    replacements: { userregistrationid },
  });

  if (getUserDetail[0] == 0) {
    return res.status(200).json({
      status: false,
      message: "No registration found!",
      results: [{ decisionkey: 0 }],
    });
  }

  // Implement and check subscription

  let userDetail = getUserDetail[0][0];

  console.log("userdetail>>>>>>>>>>>>", userDetail);

  const checkIfAlreadyCredentailsCreatedQuery = `SELECT * FROM Mas_HandleUserCredentials WHERE userregistrationid = :userregistrationid AND IsActive = true`;

  const checkIfAlreadyCredentailsCreated = await connectDB.query(
    checkIfAlreadyCredentailsCreatedQuery,
    {
      replacements: { userregistrationid },
    }
  );

  if (checkIfAlreadyCredentailsCreated[0].length > 0) {
    return res.status(200).json({
      status: false,
      message: "User profile already created!",
      results: [{ decisionkey: 3 }],
    });
  }

  if (checkIfAlreadyCredentailsCreated[0].length == 0) {
    const insertUserCredentailsQuery = `INSERT INTO Mas_HandleUserCredentials (userregistrationid, LoginUserName, userpassword, UserRole, UserName) VALUES (:userregistrationid, :LoginUserName, :userpassword, 'Admin', :UserName);`;

    await connectDB.query(insertUserCredentailsQuery, {
      replacements: {
        userregistrationid,
        LoginUserName: userDetail.loginmobilenumber,
        userpassword,
        UserName: userDetail.businessname,
      },
    });

    const checkIfDefaultCatAvaQuery = `SELECT * FROM MAS_Category WHERE userregistrationid = ${userregistrationid} AND CategoryName = 'uncategorized' AND isactive = true and isdefault = true`;

    const checkIfDefaultCatAva = await connectDB.query(
      checkIfDefaultCatAvaQuery
    );

    if (checkIfDefaultCatAva[0].length == 0) {
      await connectDB.query(
        `INSERT INTO mas_category (userregistrationid, CategoryName, isdefault) VALUES (${userregistrationid}, 'uncategorized', true)`
      );
    }

    //checking setting_config

    const checkIfDefaultConfig = `SELECT * FROM configuration WHERE userregistrationid = :userregistrationid`;

    const checkIfDefaultConfigQuery = await connectDB.query(
      checkIfDefaultConfig,
      { replacements: { userregistrationid } }
    );
    
    console.log("check|DefaultConfig",checkIfDefaultConfigQuery[0]);
    if (checkIfDefaultConfigQuery[0].length == 0) {
      const insertUserDefaultSettings = `
      INSERT INTO configuration (
        userregistrationid, 
        businessname, 
        businessaddress, 
        businessmobile, 
        businessemail, 
        gst, 
        language
      ) 
      VALUES (:userregistrationid, :businessname, :businessaddress, :businessmobile, :businessemail, :gst, :language)
    `;
      console.log("uptohere is fine<><><><><><><><><><");

      await connectDB.query(insertUserDefaultSettings, {
        replacements: {
          userregistrationid,
          businessname: userDetail.businessname,
          businessaddress: userDetail.businessaddress,
          businessmobile: userDetail.loginmobilenumber,
          businessemail: userDetail.email,
          gst: userDetail.gstnumber,
          language: 'English',
        },
      });

      return res.status(200).json({
        status: true,
        message: "Password created successfully!",
        results: [{ decisionkey: 1 }],
      });
    }
  }
};

module.exports = { createPassword };
