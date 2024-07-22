const connectDB = require("../config/dbConfig");

const getUnits = async (req, res) => {
  try {
    const getUnitsQuery = `SELECT * FROM MAS_Units WHERE IsActive = true`;
    const getUnits = await connectDB.query(getUnitsQuery)
    return res.status(200).json({
      status: true,
      message: "Units listed successfully!",
      results: getUnits[0],
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error!", error: err });
  }
};

const getTaxTypes = async (req, res) => {
  try {
    const getTaxTypeQuery = `SELECT * FROM MAS_TaxType WHERE IsActive = true`;
    const getTaxType = await connectDB.query(getTaxTypeQuery)
    
    return res.status(200).json({
      status: true,
      message: "Taxtype listed successfully!",
      results: getTaxType[0],
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error!", error: err });
  }
};

module.exports = { getUnits,getTaxTypes};