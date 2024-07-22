const connectDB = require("../config/dbConfig");

const checkIfValidUser = async (req, res, next) => {
  try {
    const { userregistrationid } = req.body;

    if (!userregistrationid) {
      return res.status(200).json({
        status: false,
        message: "Missing required field!",
        requiredFields: "userregistrationid",
      });
    }

    const getUserDetailQuery = `SELECT * FROM mas_user_device_registration 	WHERE userregistrationid = :userregistrationid AND IsActive = true`;
    const getUserDetail = await connectDB.query(getUserDetailQuery, {
      replacements: { userregistrationid },
    });

    let userDetail = getUserDetail[0];
    console.log("UserDetail in Middleware",getUserDetail[0]);
    // let isApproved = userDetail.some((itm) => itm.isapproved == true);
    let isApproved = true
    let isActive = userDetail.some((itm) => itm.isactive == true);
    // let appStatus = userDetail.some((itm) => itm.appstatus == true);
    let appStatus = true
    let isSubscription = userDetail.some((itm) => itm.issubscription == true);
    // let isPawwordUpdated = userDetail.some((itm) => itm.UserPassword !== null);
 
    if (userDetail.length !== 1) {
      return res.status(200).json({
        status: false,
        message: "No such user or duplicate user!",
      });
    }

    if (!isApproved) {
      return res.status(200).json({
        status: false,
        message: "Some thing is pending! Pending approval!",
        requiredFields: "isApproved, isActive, appStatus, isSubscription",
        status: { isApproved: isApproved },
        results: userDetail,
      });
    }

    if (!isActive) {
      return res.status(200).json({
        status: false,
        message: "Some thing is pending! User not active!",
        requiredFields: "isApproved, isActive, appStatus, isSubscription",
        results: userDetail,
      });
    }

    if (!appStatus) {
      return res.status(200).json({
        status: false,
        message: "Some thing is pending! App is not active!",
        requiredFields: "isApproved, isActive, appStatus, isSubscription",
        status: { appStatus: appStatus },
        results: userDetail,
      });
    }

    if (!isSubscription) {
      return res.status(200).json({
        status: false,
        message: "Some thing is pending! No active subscription!",
        requiredFields: "isApproved, isActive, appStatus, isSubscription",
        status: { isSubscription: isSubscription },
        results: userDetail,
      });
    }

    // if (!isPawwordUpdated) {
    //   return res.status(200).json({
    //     status: false,
    //     message: "Some thing is pending! Password not updated!",
    //     requiredFields:
    //       "isApproved, isActive, appStatus, isSubscription, isPawwordUpdated",
    //   });
    // }

    if (
      isApproved &&
      isActive &&
      appStatus &&
      isSubscription &&
      userDetail.length == 1
    ) {
      return next();
    } else {
      return res.status(200).json({
        status: false,
        message: "Some thing is pending!",
        requiredFields: "isApproved, isActive, appStatus, isSubscription",
      });
    }
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Internal server error!", error: err });
  }
};

module.exports = checkIfValidUser;
