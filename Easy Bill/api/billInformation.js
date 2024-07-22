const express = require("express");
const router = express.Router();

const {
  getBill,
  addBill,
  cancelBill,
  getStaffCancelReport
} = require("../controllers/billController.js");

router
  .post("/get", getBill)
  .post("/", addBill)
  .delete("/", cancelBill)
  .post("/getcancel", getStaffCancelReport)


module.exports = router;
