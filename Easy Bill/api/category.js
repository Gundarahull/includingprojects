const express = require("express");
const router = express.Router();

const {
  getCategory,
  addCategory,
  editCategory,
  deleteCategory,
} = require("../controllers/categoryController");

router
  .post("/get", getCategory)
  .post("/", addCategory)
  .put("/", editCategory)
  .delete("/", deleteCategory);

module.exports = router;
