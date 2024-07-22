require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { env } = require("process");
const path = require("path");

const connectDB = require("./config/dbConfig");
const checkIfValidUser = require("./middleware/checkIfValidUser");

const app = express();
const PORT = process.env.PORT || 8002;

app.use(cors());
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));
app.use(express.static(path.resolve(__dirname, "public")));
app.use(cookieParser());

// app.get("/", (req, res) => {
//     res.json({ message: "Hey this is my API running 🥳 - DB connected" });
//   });

app.use("/register", require("./api/register"));
app.use('/subscriptionplans',require('./api/manageSubscription.js'))
// Subscription
app.use('/mobilevalidate',require("./api/validateMobileNumber"))
app.use("/login", require("./api/login.js"));
app.use('/',require('./api/uploadDownload.js'))

app.use(checkIfValidUser);
app.use("/createpassword", require("./api/createPassword"));
app.use("/products", require("./api/products"));
app.use("/category", require("./api/category"));
app.use("/staff", require("./api/staffManagement"));
app.use("/billinformation", require("./api/billInformation"));

app.use("/utilites", require("./api/utilities"));
app.use('/settings',require('./api/setting.js'))
app.use('/profile',require('./api/profile.js'))
app.use('/logout',require('./api/logout.js'))
app.use('/cancelbill',require('./api/cancelBill.js'))

app.use('/billreport',require('./api/billReport.js'))
app.use('/filterbills',require('./api/filterBills.js'))


connectDB
  .authenticate()
  .then(() =>
    app.listen(PORT, () => console.log(`server running on port ${PORT}`))
  )
  .catch((err) => console.log(`Error while connecting to DB - ${err}`));

// Export the Express API
module.exports = app;
