const connectDB = require("../config/dbConfig");

const getStaff = async (req, res) => {
  try {
    const { userregistrationid } = req.body;
    if (!userregistrationid) {
      return res.status(400).json({
        status: false,
        message: "Missing required field!",
        requiredFields: "userregistrationid",
      });
    }

    const getStaff = await getAllFunc(userregistrationid);

    return res.status(200).json({
      status: true,
      message: "Listing staffs!",
      results: getStaff[0],
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error!", error: err });
  }
};

const addStaff = async (req, res) => {
  try {
    const { userregistrationid, loginusername, userpassword, fullname } =
      req.body;

    if (!userregistrationid && !loginusername && !userpassword) {
      return res.status(400).json({
        status: false,
        message: "Missing required field!",
        requiredFields:
          "userregistrationid, loginusername, userpassword, username",
      });
    }

    // const getStaff = await getAllFunc(userregistrationid);

    const getQuery = `SELECT * FROM Mas_HandleUserCredentials WHERE loginusername = :loginusername AND UserRole = 'Staff' AND IsActive = true`;

    const getStaff = await connectDB.query(getQuery, {
      replacements: { loginusername },
    });

    const checkIfStaffExist = getStaff[0].some(
      (itm) => itm.loginusername === loginusername
    );

    if (checkIfStaffExist) {
      return res.status(400).json({
        status: false,
        message: "loginusername already exist!",
        requiredFields: "userregistrationid, loginusername, userpassword",
      });
    }

    const insertUserCredentailsQuery = `INSERT INTO Mas_HandleUserCredentials (userregistrationid, loginusername, userpassword, UserRole,fullname) VALUES (:userregistrationid, :loginusername, :userpassword, 'Staff',:fullname);`;

    await connectDB.query(insertUserCredentailsQuery, {
      replacements: {
        userregistrationid,
        loginusername,
        userpassword,
        fullname,
      },
    });
    const getUpdatedStaff = await getAllFunc(userregistrationid);
    return res.status(200).json({
      status: true,
      message: "Staff created successfully!",
      results: getUpdatedStaff[0],
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error!", error: err });
  }
};

const editStaff = async (req, res) => {
  try {
    const {
      usercredentialsid,
      userregistrationid,
      loginusername,
      userpassword,
      fullname,
    } = req.body;

    if (
      !userregistrationid ||
      !usercredentialsid ||
      !loginusername ||
      !userpassword ||
      !fullname
    ) {
      return res.status(400).json({
        status: false,
        message: "Missing required field!",
        requiredFields:
          "usercredentialsid, userregistrationid, loginusername, userpassword,fullname",
      });
    }

    const getQuery = `SELECT * FROM Mas_HandleUserCredentials WHERE loginusername = :loginusername and usercredentialsid = :usercredentialsid AND userregistrationid = :userregistrationid AND UserRole = 'Staff' AND IsActive = true`;

    const getStaff = await connectDB.query(getQuery, {
      replacements: {
        loginusername,
        usercredentialsid,
        userregistrationid,
      },
    });

    //TO CHECK---agin
    // const checkIfStaffExist = getStaff[0].some(
    //   (itm) => itm.loginusername === loginusername
    // );

    // if (checkIfStaffExist) {
    //   return res.status(400).json({
    //     status: false,
    //     message: "loginusername already exist!",
    //     requiredFields:
    //       "usercredentialsid, userregistrationid, loginusername, userpassword",
    //   });
    // }

    if (getStaff[0].length > 0) {
      const updateUserCredentailsQuery = `UPDATE Mas_HandleUserCredentials SET loginusername =:loginusername, userpassword = :userpassword, fullname =:fullname WHERE userCredentialsId = :usercredentialsid AND userregistrationid = :userregistrationid AND UserRole = 'Staff' AND IsActive = true`;

      await connectDB.query(updateUserCredentailsQuery, {
        replacements: {
          loginusername,
          userpassword,
          usercredentialsid,
          userregistrationid,
          fullname,
        },
      });
      // const getUpdatedStaff = await getAllFunc(userregistrationid,usercredentialsid);
      const updatedQuery = `SELECT * FROM Mas_HandleUserCredentials WHERE userregistrationid = :userregistrationid and userCredentialsId = :usercredentialsid  AND UserRole = 'Staff' AND IsActive = true`;
      const getUpdatedStaffResult = await connectDB.query(updatedQuery, {
        replacements: {
          userregistrationid,
          usercredentialsid,
        },
      });

      const getUpdatedStaff = await getAllFunc(userregistrationid);
      return res.status(200).json({
        status: true,
        message: "Staff editied successfully!",
        results: getUpdatedStaff[0],
      });
    }
    return res.status(400).json({
      status: false,
      message: "loginusername doesn't exist!",
      results: [],
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error!", error: err });
  }
};

const deleteStaff = async (req, res) => {
  try {
    const { userCredentialsId, userregistrationid } = req.body;
    if (!userCredentialsId && !userregistrationid) {
      return res.status(400).json({
        status: false,
        message: "Missing required field!",
        requiredFields: "userCredentialsId, userregistrationid",
      });
    }
    const deleteStaffQuery = `UPDATE Mas_HandleUserCredentials SET IsActive = false WHERE userCredentialsId = :userCredentialsId AND userregistrationid = :userregistrationid AND UserRole = 'Staff' AND IsActive = true`;

    await connectDB.query(deleteStaffQuery, {
      replacements: {
        userCredentialsId,
        userregistrationid,
      },
    });
    const getUpdatedStaff = await getAllFunc(userregistrationid);
    return res.status(200).json({
      status: true,
      message: "Staff deleted successfully!",
      results: getUpdatedStaff[0],
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error!", error: err });
  }
};

async function getAllFunc(userregistrationid) {
  const getQuery = `SELECT * FROM Mas_HandleUserCredentials WHERE userregistrationid = :userregistrationid AND UserRole = 'Staff' AND IsActive = true`;

  const getItems = await connectDB.query(getQuery, {
    replacements: { userregistrationid },
  });

  return getItems;
}

module.exports = { getStaff, addStaff, editStaff, deleteStaff };
