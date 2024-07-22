const { and } = require("sequelize");
const connectDB = require("../config/dbConfig");

const addBill = async (req, res) => {
  try {
    const addBillDetails = req.body;
    console.log("******************addBillDetails******************");
    console.log(addBillDetails);
    const addBillQuery = `SELECT * from funaddingbill('${JSON.stringify(addBillDetails)}')`;

    const respons = await connectDB.query(addBillQuery);
    console.log("******************respons******************");
    console.log(respons);

    // Send a success response
    return res.status(200).json({
      status: true,
      message: "Bill added successfully!",
      results: [],
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error!", error: err });
  }
};

const getBill = async (req, res) => {
  try {
    const { userregistrationid, billtype } = req.body;
    if (!userregistrationid && !billtype) {
      return res.status(400).json({
        status: false,
        message: "Missing required field!",
        requiredFields: "userregistrationid,billtype",
      });
    }
    if (
      billtype != "bill" &&
      billtype != "staff" &&
      billtype != "product" &&
      billtype != "cancel"
    ) {
      return res.status(400).json({
        status: false,
        message: "Missing required field!",
        requiredFields:
          "billtype should be any one of this bill,staff,product,cancel",
      });
    }

    const getBillInfoQuery = `SELECT uniquebillid, shopbillid, userregistrationid, usercredentialsid, shopproductid, quantity, totalquantityamount, paymentmode, isactive FROM BillingInformation WHERE userregistrationid = :userregistrationid`;

    const getBillInfo = await connectDB.query(getBillInfoQuery, {
      replacements: { userregistrationid },
    });
    console.log(
      "******************getBillInfo******************",
      getBillInfo[0]
    );

    const rawBill = getBillInfo[0] ? getBillInfo[0] : [];

    const uniqueShopBillIds = rawBill.reduce((acc, obj) => {
      if (!acc.includes(obj.shopbillid) && obj.isactive === true) {
        acc.push(obj.shopbillid);
      }
      return acc;
    }, []);
    console.log(
      "******************uniqueShopBillIds******************",
      uniqueShopBillIds[0]
    );

    const billWiseReport = uniqueShopBillIds.map((shopBillId) => {
      const filteredData = rawBill.filter(
        (obj) => obj.shopbillid == shopBillId && obj.isactive == true
      );
      const billDate = filteredData[0].createdon;
      const sumquantity = filteredData.reduce(
        (total, obj) => total + parseInt(obj.quantity),
        0
      );
      const sumtotalquantityamount = filteredData.reduce(
        (total, obj) => total + parseInt(obj.totalquantityamount),
        0
      );

      return {
        shopbillid: shopBillId,
        billDate,
        sumquantity,
        sumtotalquantityamount,
      };
    });

    const uniqueStaffIds = rawBill.reduce((acc, obj) => {
      if (!acc.includes(obj.usercredentialsid) && obj.isactive === true) {
        acc.push(obj.usercredentialsid);
      }
      return acc;
    }, []);

    const staffWiseReport = uniqueStaffIds.map((staffId) => {
      const filteredData = rawBill.filter(
        (obj) => obj.usercredentialsid == staffId
      );
      const sumquantity = filteredData.reduce(
        (total, obj) => total + parseInt(obj.quantity),
        0
      );
      const sumtotalquantityamount = filteredData.reduce(
        (total, obj) => total + parseInt(obj.totalquantityamount),
        0
      );

      return {
        staffid: staffId,
        sumquantity,
        sumtotalquantityamount,
      };
    });

    const uniqueProductIds = rawBill.reduce((acc, obj) => {
      if (!acc.includes(obj.shopproductid) && obj.isactive === true) {
        acc.push(obj.shopproductid);
      }
      return acc;
    }, []);

    const productWiseReport = uniqueProductIds.map((productId) => {
      const filteredData = rawBill.filter(
        (obj) => obj.shopproductid == productId
      );
      const sumquantity = filteredData.reduce(
        (total, obj) => total + parseInt(obj.quantity),
        0
      );
      const sumtotalquantityamount = filteredData.reduce(
        (total, obj) => total + parseInt(obj.totalquantityamount),
        0
      );

      return {
        productId: productId,
        sumquantity,
        sumtotalquantityamount,
      };
    });

    const uniqueCancelBillIds = rawBill.reduce((acc, obj) => {
      if (!acc.includes(obj.shopbillid) && obj.isactive === false) {
        acc.push(obj.shopbillid);
      }
      return acc;
    }, []);

    const cancelReport = uniqueCancelBillIds.map((cancelBillId) => {
      const filteredData = rawBill.filter(
        (obj) => obj.shopbillid == cancelBillId && obj.isactive == false
      );
      const billDate = filteredData[0].createdon;
      const sumquantity = filteredData.reduce(
        (total, obj) => total + parseInt(obj.quantity),
        0
      );
      const sumtotalquantityamount = filteredData.reduce(
        (total, obj) => total + parseInt(obj.totalquantityamount),
        0
      );

      return {
        cancelbillid: cancelBillId,
        billDate: "2024-06-19 12:57:40.030946",
        sumquantity,
        sumtotalquantityamount,
      };
    });

    if (billtype == "bill") {
      return res.status(200).json({
        status: true,
        message: "Dilplaying bill report!",
        results: billWiseReport,
      });
    }
    if (billtype == "staff") {
      return res.status(200).json({
        status: true,
        message: "Dilplaying staff report",
        results: staffWiseReport,
      });
    }
    if (billtype == "product") {
      return res.status(200).json({
        status: true,
        message: "Dilplaying product report",
        results: productWiseReport,
      });
    }
    if (billtype == "cancel") {
      return res.status(200).json({
        status: true,
        message: "Dilplaying cancel report",
        results: cancelReport,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error!", error: err });
  }
};

const getStaffCancelReport = async (req, res) => {
  try {
    const { userregistrationid, billtype, usercredentialsid } = req.body;
    if (!userregistrationid && !billtype && !usercredentialsid) {
      return res.status(400).json({
        status: false,
        message: "Missing required field!",
        requiredFields: "userregistrationid,billtype,usercredentialsid",
      });
    }
    if (billtype != "cancel") {
      return res.status(400).json({
        status: false,
        message: "Missing required field!",
        requiredFields: "billtype should be cancel",
      });
    }
    if (billtype == "cancel") {
      return res.status(200).json({
        status: true,
        message: "Dilplaying staff cancel bill report!",
        results: [],
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error!", error: err });
  }
};

const cancelBill = async (req, res) => {
  try {
    const { userregistrationid, billId } = req.body;
    if (!userregistrationid && !billId) {
      return res.status(400).json({
        status: false,
        message: "Missing required field!",
        requiredFields: "userregistrationid,billId",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Cancelled!",
      results: [],
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error!", error: err });
  }
};


module.exports = {
  getBill,
  addBill,
  cancelBill,
  getStaffCancelReport,
};
