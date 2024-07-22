//taking parser class from json2csv
const { Parser } = require("json2csv");
const connectDB = require("../config/dbConfig");
const path = require("path");
const XLSX = require("xlsx");
const fs = require("fs");

const downloadData = async (req, res) => {
  const { shopbillid, userregistrationid, reporttype, credentialsid } =
    req.body;
  try {
    if (!userregistrationid) {
      return res.status(400).json({
        status: false,
        message: "Missing required field!",
        requiredFields: "userregistrationid",
      });
    }
    //to get Info of partcular User
    const getUserDetailQuery = `SELECT * FROM mas_user_device_registration WHERE userregistrationid = :userregistrationid AND IsActive = true`;
    const getUserDetail = await connectDB.query(getUserDetailQuery, {
      replacements: { userregistrationid },
    });
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleString();
    if (shopbillid > 0) {
      console.log(
        "In the SHopBILL iD>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
      );
      const ProductBillDetail = `SELECT * from fungetdetailproductbilllist(:userregid,:shopbillid)`;
      const ProductBillDetailResult = await connectDB.query(ProductBillDetail, {
        replacements: {
          userregid: userregistrationid,
          shopbillid: shopbillid,
        },
      });
      if (ProductBillDetailResult[0].length > 0) {
        const json2csv = new Parser();
        const csv = json2csv.parse(ProductBillDetailResult[0]);
        const filename = `${getUserDetail[0][0].loginmobilenumber}_DetailBill_${formattedDate}.csv`;
        // Set headers for CSV download
        res.setHeader("Content-Type", "text/csv");
        res.setHeader(
          "Content-Disposition",
          `attachment; filename="${filename}"`
        );
        return res.send(csv);
      }
      if (ProductBillDetailResult[0].length == 0) {
        return res.status(400).json({
          status: false,
          message: "No data found",
          results: [],
        });
      }
    }
    const reportQuery = `
      SELECT * from funbillreports(:billid, :userregid, :credentialsid,:reporttype)
    `;

    const reportResult = await connectDB.query(reportQuery, {
      replacements: {
        billid: shopbillid,
        userregid: userregistrationid,
        reporttype: reporttype,
        credentialsid: credentialsid,
      },
    });
    console.log(reportResult);
    console.log("----------------------------------");
    if (reportResult[0].length > 0) {
      const json2csv = new Parser();
      const csv = json2csv.parse(reportResult[0]);
      console.log("CSV IN DOWNLOAD", csv);
      const filename = `${getUserDetail[0][0].loginmobilenumber}_${formattedDate}.csv`;
      // Set headers for CSV download
      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${filename}"`
      );
      return res.send(csv);
    } else {
      return res.status(400).json({
        status: false,
        message: "No data found",
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

const productDownload = async (req, res) => {
  const { userregistrationid } = req.body;
  try {
    if (!userregistrationid) {
      return res.status(400).json({
        status: false,
        message: "Missing required field!",
        requiredFields: "userregistrationid",
      });
    }

    const parentDir = path.join(__dirname, "..");
    const filePath = path.join(
      parentDir,
      "public",
      "download",
      "Product Data Download.xlsx"
    );

    // Send a custom header indicating the start of the download
    res.setHeader("X-Download-Initiated", "true");

    res.download(filePath, (err) => {
      if (err) {
        console.error("Error during file download:", err);
        if (!res.headersSent) {
          return res.status(500).send("Error downloading file");
        }
      } else {
        console.log("File successfully downloaded");
        // Optionally log success or handle other logic here
      }
    });
  } catch (err) {
    console.error("Error generating CSV:", err);
    if (!res.headersSent) {
      res.status(500).json({
        status: false,
        message: "Internal Server Error",
      });
    }
  }
};

const uploadData = async (req, res) => {
  console.log(req.body);
  const { userregistrationid } = req.body;
  console.log("req.body", req.body);
  try {
    if (!userregistrationid) {
      return res.status(400).json({
        status: false,
        message: "Missing required field!",
        requiredFields: "userregistrationid",
      });
    }
    const workbook = XLSX.readFile(`./public/uploads/${req.file.originalname}`);
    const sheetName = workbook.SheetNames[0];
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
    const jsonData = JSON.stringify(data, null, 2);
    console.log("data", jsonData);
    // if ((data.length === 1 && Object.keys(data[0]).every(key => key.startsWith('__EMPTY')))) {
    //   return res.status(400).json({
    //     status: false,
    //     message: "The uploaded file is empty. Please provide data to upload.",
    //   });
    // }
    // for (const i of data) {
    //   i.userregistrationid = userregistrationid;
    // }
    fs.unlinkSync(req.file.path);

    //inserting the data into db
    const insertDataQuery = ` select * from productbulkupload(:userregistrationid ,'${JSON.stringify(
      jsonData
    )}')`;
    const insertDataQueryResult = await connectDB.query(insertDataQuery, {
      replacements: {
        userregistrationid: userregistrationid,
      },
    });
    console.log("insertDataQueryResult", insertDataQueryResult);

    res.status(200).json({
      message: "File uploaded successfully",
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
  downloadData,
  productDownload,
  uploadData,
};
