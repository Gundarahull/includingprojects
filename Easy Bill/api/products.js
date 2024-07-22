const express = require("express");
const router = express.Router();

const {
  getProducts,
  addProducts,
  editProduct,
  deleteProduct
} = require("../controllers/productsController");

router.post("/get", getProducts).post("/", addProducts).put("/",editProduct).delete("/",deleteProduct);


module.exports = router;
