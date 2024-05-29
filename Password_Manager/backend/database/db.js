const mongoose = require("mongoose");
require('dotenv').config()

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("DB Connected");
  })
  .catch((err) => {
    console.log("DB Connection Failed",err);
  });

const db=mongoose.Connection

module.exports=db
