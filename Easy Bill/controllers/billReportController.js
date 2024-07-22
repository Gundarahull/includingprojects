const connectDB = require("../config/dbConfig");

const dayEndReport = async (req, res) => {
  const { userregistrationid } = req.body;

  try {
    if (!userregistrationid) {
      return res.status(400).json({
        status: false,
        message: "Missing required field!",
        requiredFields: "userregistrationid",
      });
    }

    const dayEndReportQuery = `select * from fundayendreport(:userregistrationid)
`;

    const dayEndReportResult = await connectDB.query(dayEndReportQuery, {
      replacements: {
        userregistrationid: userregistrationid,
      },
    });

    console.log("Day End Report Results", dayEndReportResult[0]);
    if (dayEndReportResult[0].length > 0) {
      return res.status(200).json({
        status: true,
        message: "Day End Report-Bills Found",
        results: dayEndReportResult[0],
      });
    }
    return res.status(200).json({
      status: true,
      message: "Day End Report-No Bills Found",
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

const billReport = async (req, res) => {
  const {
    shopbillid,
    userregistrationid,
    reporttype,
    credentialsid,
    shopproductid,
    uniqueshopbillid,
  } = req.body;

  if (!userregistrationid) {
    return res.status(400).json({
      status: false,
      message: "Please provide userregistrationid",
    });
  }

  try {
    //introducing the Procedure
    const billReportQuery = `CALL pr_bill_reports(:userregistrationid, :shopbillid, :reporttype, :credentialsid,:shopproductid ,:uniqueshopbillid, 'result');
                            FETCH ALL IN "result";`;
    const billReportResult = await connectDB.query(billReportQuery, {
      replacements: {
        userregistrationid: userregistrationid,
        reporttype: reporttype,
        credentialsid: credentialsid,
        uniqueshopbillid: uniqueshopbillid,
        shopproductid: shopproductid,
        shopbillid: shopbillid,
      },
    });
    console.log("Reportt results", billReportResult[0].shift());
    console.log("again Reports Data", billReportResult[0].length);
    if (billReportResult[0].length > 0) {
      return res.status(200).json({
        status: true,
        message: "Bills Reports fetched successfully",
        results: billReportResult[0],
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

const paymentMode = async (req, res) => {
  const { userregistrationid, uniqueshopbillid } = req.body;
  if (!userregistrationid || !uniqueshopbillid) {
    return res.status(400).json({
      status: false,
      message: "Missing required field!",
      requiredFields: "userregistrationid,uniqueshopbillid",
    });
  }
  try {
    const paymentMode = `select 
    paymentmode
    from 
      billinginformation
    where 
        userregistrationid= :userregistrationid and uniqueshopbillid= :uniqueshopbillid
    group by
      paymentmode
    `;

    const paymentModeData = await connectDB.query(paymentMode, {
      replacements: {
        userregistrationid: userregistrationid,
        uniqueshopbillid: uniqueshopbillid,
      },
    });
    if (paymentModeData.length > 0) {
      return res.status(200).json({
        status: true,
        message: "Payment mode fetched!",
        results: paymentModeData[0],
      });
    } else {
      return res.status(200).json({
        status: false,
        message: "Payment mode not found!",
        results: [],
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

const updatePaymentmode = async (req, res) => {
  const { userregistrationid, uniqueshopbillid, paymentmode } = req.body;
  if (!userregistrationid || !uniqueshopbillid || !paymentmode) {
    return res.status(400).json({
      status: false,
      message: "Missing required field!",
      requiredFields: "userregistrationid,uniqueshopbillid,paymentmode",
    });
  }
  try {
    const updateBillingInformationQuery = `
  UPDATE billinginformation
  SET 
    paymentmode = :paymentmode
  WHERE 
    userregistrationid = :userregistrationid AND uniqueshopbillid = :uniqueshopbillid
`;
    const updatepaymentmode = await connectDB.query(
      updateBillingInformationQuery,
      {
        replacements: {
          paymentmode,
          userregistrationid,
          uniqueshopbillid,
        },
      }
    );
    const billReportQuery = `SELECT
                                    billinginformation.shopbillid,
                                uniqueshopbillid,
                                paymentmode,
                                count(quantity) as totalquantity, 
                                to_char(createdon, 'YYYY-MM-DD HH24:MI') as formatted_createdon,
                                SUM(CAST(totalquantityamount AS NUMERIC)) AS totalamount
                              FROM 
                                billinginformation
                              WHERE 
                                userregistrationid = :userregistrationid and isactive=true
                              GROUP BY 
                                uniqueshopbillid,
                                paymentmode, 
                                formatted_createdon,
                                billinginformation.shopbillid
                              ORDER BY 
                                shopbillid ASC;
;`;
    const billReportQueryResult = await connectDB.query(billReportQuery, {
      replacements: {
        userregistrationid: userregistrationid,
      },
    });
    console.log("billReportQueryResult", billReportQueryResult[0]);
    if (billReportQueryResult[0].length > 0) {
      return res.status(200).json({
        status: true,
        message: "Bill Report Found",
        results: billReportQueryResult[0],
      });
    }
    return res.status(200).json({
      status: true,
      message: "No Bill Detail Found",
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
  dayEndReport,
  billReport,
  paymentMode,
  updatePaymentmode,
};
