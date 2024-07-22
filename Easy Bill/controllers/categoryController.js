const connectDB = require("../config/dbConfig");

const getCategory = async (req, res) => {
  try {
    const { userregistrationid } = req.body;
    if (!userregistrationid) {
      return res.status(400).json({
        status: false,
        message: "Missing required field!",
        requiredFields: "userregistrationid",
      });
    }

    const getCategory = await getAllCategory(userregistrationid);
    return res.status(200).json({
      status: true,
      message: "Category listed successfully!",
      results: getCategory[0],
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error!", error: err });
  }
};

const addCategory = async (req, res) => {
  const { userregistrationid, categoryname } = req.body;
  try {
    if (!userregistrationid && !categoryname) {
      return res.status(400).json({
        status: false,
        message: "Missing required field!",
        
        requiredFields: "userregistrationid, categoryname",
      });
    }

    //Check duplicate categoryname with same userregistrationid
    const checkCategory = await getAllCategory(userregistrationid);
    if (
      checkCategory[0].some(
        (itm) => itm.categoryname.toLowerCase() == categoryname.toLowerCase()
      )
    ) {
      return res.status(200).json({
        status: true,
        message: "Given category already exist!",
        results: checkCategory[0],
      });
    }

    const addCategoryQuery = `INSERT INTO MAS_Category (userregistrationid, categoryname) VALUES (:userregistrationid, :categoryname);`;
    await connectDB.query(addCategoryQuery, {
      replacements: {
        userregistrationid,
        categoryname,
      },
    });

    const getCategory = await getAllCategory(userregistrationid);

    return res.status(200).json({
      status: true,
      message: "Category added successfully!",
      results: getCategory[0],
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error!", error: err });
  }
};

const editCategory = async (req, res) => {
  const { userregistrationid, categoryname, categoryid } = req.body;
  try {
    if (!userregistrationid && !categoryname && !categoryid) {
      return res.status(400).json({
        status: false,
        message: "Missing required field!",
        requiredFields: "userregistrationid, categoryname, categoryid",
      });
    }
    if (categoryname.toLowerCase() == "uncategorized") {
      return res.status(400).json({
        status: false,
        message: "Invalid edit!",
      });
    }

    // Check duplicate categoryname with same userregistrationid
    const checkCategory = await getAllCategory(userregistrationid);
    const getEditableCat = checkCategory[0].filter(
      (itm) => itm.categoryname.toLowerCase() == categoryname.toLowerCase()
    );

    if (
      getEditableCat.some(
        (itm) =>
          itm.categoryid == categoryid &&
          itm.categoryname.toLowerCase() == "uncategorized"
      )
    ) {
      return res.status(400).json({
        status: false,
        message: "Invalid edit!",
      });
    }

    if (getEditableCat.length >= 1) {
      return res.status(200).json({
        status: true,
        message: "Given category already exist!",
        results: checkCategory[0],
      });
    }

    const editCategoryQuery = `UPDATE MAS_Category SET categoryname = :categoryname WHERE userregistrationid = :userregistrationid AND categoryid = :categoryid AND IsActive = TRUE AND isdefault = FALSE;`;
    await connectDB.query(editCategoryQuery, {
      replacements: {
        userregistrationid,
        categoryname,
        categoryid,
      },
    });

    const getCategory = await getAllCategory(userregistrationid);

    return res.status(200).json({
      status: true,
      message: "Category edit successfull!",
      results: getCategory[0],
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error!", error: err });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { userregistrationid, categoryid } = req.body;
    if (!userregistrationid && !categoryid) {
      return res.status(400).json({
        status: false,
        message: "Missing required field!",
        requiredFields: "userregistrationid, categoryid",
      });
    }
    const selectDefaultCatQuery = `SELECT * FROM MAS_Category WHERE userregistrationid = ${userregistrationid} AND isdefault = true AND categoryname = 'uncategorized'`;
    const selectDefaultCat = await connectDB.query(selectDefaultCatQuery);

    if (selectDefaultCat[0].length == 0) {
      return res.status(400).json({
        status: false,
        message: "Failed to create uncatagorized catagory!",
      });
    }

    const UncategorisedId = selectDefaultCat[0][0].categoryid;
    const movingProductsToUncategorised = `UPDATE MAS_Products SET categoryid = :UncategorisedId WHERE categoryid = :categoryid AND userregistrationid = :userregistrationid`;

    await connectDB.query(movingProductsToUncategorised, {
      replacements: { categoryid, userregistrationid, UncategorisedId },
    });

    const deleteCategoryQuery = `UPDATE MAS_Category SET IsActive = false WHERE categoryid = :categoryid AND userregistrationid = :userregistrationid AND isdefault = false`;

    await connectDB.query(deleteCategoryQuery, {
      replacements: { categoryid, userregistrationid },
    });

    const getCategory = await getAllCategory(userregistrationid);
    return res.status(200).json({
      status: true,
      message: "Category delete successfully!",
      results: getCategory[0],
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error!", error: err });
  }
};

const getAllCategory = async (userregistrationid) => {
  const getCategoryQuery = `SELECT * FROM MAS_Category WHERE userregistrationid = :userregistrationid AND IsActive = true`;

  const getCategory = await connectDB.query(getCategoryQuery, {
    replacements: { userregistrationid },
  });

  return getCategory;
};

module.exports = { addCategory, getCategory, editCategory, deleteCategory };
