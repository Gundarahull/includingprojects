const connectDb = require("../config/dbConfig");

const getSetting = async (req, res) => {
  try {
    console.log("req.body>>>>>", req.body);

    const { userregistrationid } = req.body;

    if (!userregistrationid) {
      return res.status(400).json({
        status: false,
        message: "Missing required field!",
        requiredFields: "userregistrationid",
      });
    }
    const getUserSettings = await getSettings(userregistrationid);

    if (getUserSettings[0].length == 0) {
      const getUserDetailQuery = `SELECT * FROM mas_user_device_registration WHERE userregistrationid = :userregistrationid AND IsActive = true`;

      const getUserDetail = await connectDb.query(getUserDetailQuery, {
        replacements: { userregistrationid },
      });

      let userDetail = getUserDetail[0][0];

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

      await connectDb.query(insertUserDefaultSettings, {
        replacements: {
          userregistrationid,
          businessname: userDetail.businessname,
          businessaddress: userDetail.businessaddress,
          businessmobile: userDetail.loginmobilenumber,
          businessemail: userDetail.email,
          gst: userDetail.gstnumber,
          language: "English",
        },
      });

      const getUserSettings = await getSetting(userregistrationid);
      return res.status(200).json(getUserSettings[0]);
    }

    async function getSettings(userregistrationid) {
      const getUserSettingsQuery = `SELECT * FROM configuration WHERE userregistrationid = :userregistrationid and isactive=true `;

      const getUserSettings = await connectDb.query(getUserSettingsQuery, {
        replacements: { userregistrationid },
      });

      if (getUserSettings[0] && getUserSettings[0].length > 0) {
        // Process the data if the settings were found
        getUserSettings[0] = getUserSettings[0].map((setting) => {
          if (setting.timeinterval) {
            setting.timeinterval = setting.timeinterval.split(",").map(Number);
          }
          return setting;
        });
      }

      return getUserSettings;
    }

    console.log("getSettings>>>>>>>>>>>>>>>>>>>>>>>>>>", getUserSettings[0]);

    return res.status(200).json({
      status: true,
      message: "User settings Details",
      results: getUserSettings[0],
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};

const editSettings = async (req, res) => {
  const {
    businessname = "",
    businessaddress = "",
    businessmobile = "",
    businessemail = "",
    businesslogo = "",
    footerdata = "",
    userregistrationid,
    printername = "",
    printeraddress = "",
    printersize = "",
    language = "English",
    settimeinterval = "",
    emailenable = false,
    mobileenable = false,
    gstenable = false,
    footerenable = false,
    whatsappenable = false,
    bluetoothenable = false,
    usbenable = false,
    logoenable=false,
    upienable=false,
    upi=""
  } = req.body;
  console.log("body>>>>>>", req.body);
  try {
    if (!userregistrationid) {
      return res.status(400).json({
        status: false,
        message: "Missing required field!",
        requiredFields: "userregistrationid",
      });
    }
    const usbFinalValue = bluetoothenable ? false : usbenable;
    const updateQuery = `
                          UPDATE configuration 
                          SET 
                              BusinessName = :businessname, 
                              BusinessAddress = :businessaddress, 
                              BusinessMobile= :businessmobile,
                              BusinessEmail = :businessemail,
                              BusinessLogo = :businesslogo,
                              Footer = :footer,
                              printersize = :printersize, 
                              language = :language, 
                              settimeinterval = :settimeinterval,
                              emailenable = :emailenable, 
                              mobileenable = :mobileenable, 
                              gstenable = :gstenable, 
                              footerenable = :footerenable,
                              whatsappenable = :whatsappenable,
                              printername = :printername,
                              printeraddress = :printeraddress,
                              bluetooth = :bluetooth,
                              usb = :usbFinalValue,
                              logoenable = :logoenable,
                              upienable = :upienable,
                              upi = :upi
                          WHERE 
                              UserRegistrationId = :userregistrationid and isactive=true;
                          `;

    await connectDb.query(updateQuery, {
      replacements: {
        businessname,
        businessaddress,
        businessmobile,
        businessemail,
        businesslogo,
        footer: footerdata,
        printersize,
        language,
        settimeinterval: settimeinterval,
        emailenable,
        mobileenable,
        gstenable,
        footerenable,
        whatsappenable,
        printername,
        printeraddress,
        usbFinalValue,
        bluetooth: bluetoothenable,
        logoenable,
        upienable,
        upi,
        userregistrationid,
      },
    });
    const updatedQuery = `SELECT * FROM configuration WHERE userregistrationid = :userregistrationid and isactive=true`;
    let updatedData = await connectDb.query(updatedQuery, {
      replacements: {
        userregistrationid,
      },
    });
    console.log("updted query", updatedData[0]);
    if (updatedData[0] && updatedData[0].length > 0) {
      // Process the data if the settings were found
      updatedData[0] = updatedData[0].map((setting) => {
        if (setting.timeinterval) {
          setting.timeinterval = setting.timeinterval.split(",").map(Number);
        }
        return setting;
      });
    }
    console.log("updted query after>>>>>>>>>>>>>>>>>>>>", updatedData[0]);
    return res.status(200).json({
      status: true,
      message: "Successfully updated the user data for settings profile.",
      results: updatedData[0],
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};

//sending config to Staff
const sendConfigToStaff = async (req, res) => {
  const { userregistrationid } = req.body;
  try {
    const sendConfigToStaffQuery = `SELECT * FROM configuration WHERE userregistrationid = :userregistrationid AND IsActive = true`;

    let sendConfigToStaffResult = await connectDb.query(
      sendConfigToStaffQuery,
      {
        replacements: {
          userregistrationid: userregistrationid,
        },
      }
    );
    if (sendConfigToStaffResult[0] && sendConfigToStaffResult[0].length > 0) {
      // Process the data if the settings were found
      sendConfigToStaffResult[0] = sendConfigToStaffResult[0].map((setting) => {
        if (setting.timeinterval) {
          setting.timeinterval = setting.timeinterval.split(",").map(Number);
        }
        return setting;
      });
    }

    if (sendConfigToStaffResult[0].length == 0) {
      return res.status(200).json({
        status: false,
        message: "No cofiguration!",
        results: [],
      });
    }
    return res.status(200).json({
      status: true,
      message:"Config for Staff",
      results: sendConfigToStaffResult[0],
    })
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  getSetting,
  editSettings,
  sendConfigToStaff,
};
