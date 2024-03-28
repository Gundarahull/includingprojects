const { where } = require("sequelize");
const Enroll = require("../Models/Enrollement-Model");

exports.getadmin = (req, res) => {
  res.render("admin");
};

exports.postadmin = async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;

    if (username === "RAHUL" && password === "12345") {
      res.render("getenroll");
    } else {
      res.status(401).send("Unauthorized");
    }
  } catch (error) {
    console.log("Error:", error);
    res.status(500).send("Internal Server Error");
  }
};

//pending Enrollemnts
exports.getpending = async (req, res) => {
  try {
    const data = await Enroll.findAll({ where: { approve: false } });
    const viewdata = {
      enrolls: data,
    };
    res.render("pendingenroll", viewdata);
  } catch (error) {
    console.log("Error:", error);
    res.status(500).send("Internal Server Error");
  }
};

exports.editenroll = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Enroll.findByPk(id);
    const viewdata = {
      data: data,
      id: data.id,
    };
    res.render("editenroll", viewdata);
  } catch (error) {
    console.log("Error:", error);
    res.status(500).send("Internal Server Error");
  }
};

exports.updateenroll = async (req, res) => {
  try {
    console.log("body in update", req.body);
    const id = req.body.expenseid;
    // Assuming dataid is the field containing the id
    console.log("data id,", id);
    const updatedFields = {
      name: req.body.name,
      age: req.body.age,
      houseno: req.body.house,
      street: req.body.street,
      city: req.body.city,
      district: req.body.district,
      postalcode: req.body.postal,
      gender: req.body.gender,
      dob: req.body.dob,
      phonenumber: req.body.phone,
    };
    const data = await Enroll.update(updatedFields, { where: { id: id } });
    console.log("DATA after update", data);
    res.redirect("/pending");
  } catch (error) {
    console.log("Error:", error);
    res.status(500).send("Internal Server Error");
  }
};

// approve enrollemnet
exports.approved = async (req, res) => {
    try {
        const data = await Enroll.findAll({ where: { approve: true } });
        const viewdata = {
            enrolls: data,
        };
        res.render('approvedenroll', viewdata);
    } catch (error) {
        console.log("Error:", error);
        res.status(500).send("Internal Server Error");
    }
};

//for approval
exports.forapproval = async (req, res) => {
    try {
        const id = req.params.id;
        const status = await Enroll.update({ approve: true }, { where: { id: id } });
        if (status[0] === 1) {
            res.status(200).redirect('/approving');
        } else {
            res.status(404).send("Enrollment not found or could not be updated.");
        }
    } catch (error) {
        console.log("Error in forapproval controller: ", error);
        res.status(500).send("Internal Server Error");
    }
}
