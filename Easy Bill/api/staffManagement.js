const express = require("express");
const router = express.Router();

const {
  getStaff,
  addStaff,
  editStaff,
  deleteStaff,
} = require("../controllers/staffManagementController");

router
  .post("/get", getStaff)
  .post("/", addStaff)
  .put("/", editStaff)
  .delete("/", deleteStaff);

module.exports = router;
