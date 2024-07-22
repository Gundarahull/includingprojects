const connectDB = require("../config/dbConfig");


const getProducts = async (req, res) => {
  try {
    const { userregistrationid } = req.body;

    if (!userregistrationid) {
      return res.status(400).json({
        status: false,
        message: "Missing required field!",
        requiredFields: "userregistrationid",
      });
    }

    const getProducts = await getAllProductsFunc(userregistrationid);

    return res.status(200).json({
      status: true,
      message: "Listing products!",
      results: getProducts[0],
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error!", error: err });
  }
};

const addProducts = async (req, res) => {
  const {
    userregistrationid,
    productname_english,
    productname_tamil,
    categoryid,
    istoken,
    qrbarcode,
    price,
    unitid,
    taxtypeid,
    taxpercentage,
  } = req.body;
  try {
    if (
      !userregistrationid &&
      !productname_english &&
      !productname_tamil &&
      !categoryid &&
      !istoken &&
      !price &&
      !unitid &&
      !taxtypeid &&
      !taxpercentage
    ) {
      return res.status(400).json({
        status: false,
        message: "Missing required field!",
        requiredFields:
          "userregistrationid,productname_english,productname_tamil,categoryid,istoken,price,unitid,taxtypeid,taxpercentage",
      });
    }

    // Check if product already availabe - Yet to implement

    const addProductQuery = `INSERT INTO MAS_Products (userregistrationid, productname_english, productname_tamil, categoryid, istoken,qrbarcode, price, unitid, taxtypeid, taxpercentage,shopproductiD) VALUES (:userregistrationid, :productname_english, :productname_tamil, :categoryid, :istoken, :qrbarcode, :price, :unitid, :taxtypeid, :taxpercentage, funshopproductiD(:userregistrationid));`;
    await connectDB.query(addProductQuery, {
      replacements: {
        userregistrationid,
        productname_english,
        productname_tamil,
        categoryid,
        istoken,
        qrbarcode,
        price,
        unitid,
        taxtypeid,
        taxpercentage,
      },
    });

    const getProducts = await getAllProductsFunc(userregistrationid);

    return res.status(200).json({
      status: true,
      message: "Product added successfully!",
      results: getProducts[0],
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error!", error: err });
  }
};

const editProduct = async (req, res) => {
  try {
    const {
      userregistrationid,
      shopproductid,
      productname_english,
      productname_tamil,
      categoryid,
      istoken,
      qrbarcode,
      price,
      unitid,
      taxtypeid,
      taxpercentage,
    } = req.body;

    if (
      !userregistrationid &&
      !shopproductid &&
      !productname_english &&
      !productname_tamil &&
      !categoryid &&
      !istoken &&
      !price &&
      !unitid &&
      !taxtypeid &&
      !taxpercentage
    ) {
      return res.status(400).json({
        status: false,
        message: "Missing required field!",
        requiredFields:
          "userregistrationid,shopproductid,productname_english,productname_tamil,categoryid,istoken,price,unitid,taxtypeid,taxpercentage",
      });
    }

    const editProductQuery = `UPDATE mas_products SET productname_english = :productname_english, productname_tamil = :productname_tamil, categoryid= :categoryid, istoken = :istoken, qrbarcode= :qrbarcode, price = :price, unitid = :unitid, taxtypeid = :taxtypeid, taxpercentage = :taxpercentage WHERE userregistrationid = :userregistrationid AND shopproductid = :shopproductid AND IsActive = TRUE;`;

    await connectDB.query(editProductQuery, {
      replacements: {
        userregistrationid,
        shopproductid,
        productname_english,
        productname_tamil,
        categoryid,
        istoken,
        qrbarcode,
        price,
        unitid,
        taxtypeid,
        taxpercentage,
      },
    });

    const getProducts = await getAllProductsFunc(userregistrationid);

    return res.status(200).json({
      status: true,
      message: "Product edit successfull!",
      results: getProducts[0],
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error!", error: err });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { userregistrationid, shopproductid } = req.body;

    if (!userregistrationid && !shopproductid) {
      return res.status(400).json({
        status: false,
        message: "Missing required field!",
        requiredFields: "userregistrationid, shopproductid",
      });
    }

    const deleteProductQuery = `UPDATE MAS_Products SET IsActive = false WHERE shopproductid = :shopproductid AND userregistrationid = :userregistrationid`;

    await connectDB.query(deleteProductQuery, {
      replacements: { shopproductid, userregistrationid },
    });

    const getProducts = await getAllProductsFunc(userregistrationid);

    return res.status(200).json({
      status: true,
      message: "Product deleted successfully!",
      results: getProducts[0],
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error!", error: err });
  }
};

async function getAllProductsFunc(userregistrationid) {
  const getProductsQuery = `SELECT 
        MAS_Products.*,
        MAS_Units.show_quantity_popup,
        MAS_Units.is_decimal_allowed
    FROM 
        MAS_Products
    INNER JOIN 
        MAS_Units ON MAS_Products.UnitId = MAS_Units.UnitId
    WHERE 
        MAS_Products.UserRegistrationId = :userregistrationid
        AND MAS_Products.IsActive = true AND MAS_Units.isactive = TRUE`
  const getProducts = await connectDB.query(getProductsQuery, {
    replacements: { userregistrationid },
  });

  return getProducts;
}

module.exports = { getProducts, addProducts, editProduct, deleteProduct };
