const mongoose = require("mongoose");

const detailsSchema = new mongoose.Schema(
  {
    sitename: {
      type: String,
    },
    username: {
      type: String,
    },
    password: {
      type: String,
    },
  },
  { timestamps: true }
);

const Details = mongoose.model("details", detailsSchema);
module.exports = Details;
