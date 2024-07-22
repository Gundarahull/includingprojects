const connectDB = require("../config/dbConfig");

const cancelBillCancel = async (req, res) => {
  const { userregistrationid, shopbillid } = req.body;
  try {
    if (!userregistrationid || !shopbillid) {
      return res.status(400).json({
        status: false,
        message: "Missing required fields!",
        requiredFields: "userregistrationid or shopbillid",
      });
    }
    const checkingBillQuery =
      "select shopbillid from billinginformation where userregistrationid= :userregistrationid and shopbillid= :shopbillid and isactive=true ";
    const checkingBillResult = await connectDB.query(checkingBillQuery, {
      replacements: { userregistrationid, shopbillid },
    });
    if (checkingBillResult[0].length > 0) {
      const cancelBillQuery = `update billinginformation set isactive=false where userregistrationid= :userregistrationid and shopbillid= :shopbillid and isactive=true `;
      await connectDB.query(cancelBillQuery, {
        replacements: {
          userregistrationid,
          shopbillid,
        },
      });
      return res.status(200).json({
        status: true,
        message: "Cancelled the Bill successfully!",
        results: [],
      });
    }
    return res.status(500).json({
      status: false,
      message: "There is No Bill With ShopBillId and UserRegistrationId",
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



module.exports = {
  cancelBillCancel,
};
