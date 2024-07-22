const connectDB = require("../config/dbConfig");

const filterBills = async (req, res) => {
  const {
    userregistrationid,
    fromDate,
    toDate,
    reporttype,
    shopproductid,
    usercredentialsid,
    paymentmode,
  } = req.body;
  if (!userregistrationid) {
    return res.status(400).json({
      status: false,
      message: "Missing required field!",
      requiredFields: "userregistrationid",
    });
  }
  try {
    const filterBillsQuery = `CALL pr_filter_bills(:userregistrationid, :fromDate, :toDate, :reporttype, :paymentmode,:shopproductid ,:usercredentialsid, 'result');
                                FETCH ALL IN "result";`;
    const filterBillsResult = await connectDB.query(filterBillsQuery, {
      replacements: {
        userregistrationid: userregistrationid,
        fromDate: fromDate,
        toDate: toDate,
        reporttype: reporttype,
        paymentmode: paymentmode,
        shopproductid: shopproductid,
        usercredentialsid: usercredentialsid,
      },
    });
    console.log("filter results",filterBillsResult[0].shift());
    console.log("again filter Data",filterBillsResult[0].length);
    if (filterBillsResult[0].length > 0) {
      return res.status(200).json({
        status: true,
        message: "Bills filtered successfully",
        results: filterBillsResult[0],
      });
    }
    return res.status(200).json({
      status: false,
      message: "No bills found",
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
  filterBills,
};
