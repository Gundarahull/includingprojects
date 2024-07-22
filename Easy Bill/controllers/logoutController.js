const connectDb = require("../config/dbConfig");

const logout = async (req, res) => {

  const { usercredentialsid } = req.body;
  console.log("logout>>>>>>>>>>");
  console.log("Re.body",req.body);
  try {
    if (!usercredentialsid) {
      return res.status(400).json({
        status: false,
        message: "Missing required field!",
        requiredFields: "usercredentialsid",
      });
    }
    const logoutQuery = `update manageuserlogin set isactive=false where usercredentialsid = :usercredentialsid AND isactive = true`;
    await connectDb.query(logoutQuery, {
      replacements: {
        usercredentialsid,
      },
    });
    return res.status(200).json({
      status: true,
      message: "Logged out successfully!",
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  logout,
};
