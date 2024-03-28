const Enroll = require("../Models/Enrollement-Model");

exports.getenrollpage = (req, res) => {
  res.render("enroll");
};

exports.postenroll = async (req, res) => {
    try {
        const enrolls = {
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
        console.log(enrolls);
        const result = await Enroll.create(enrolls);
        console.log("Successfully inserted into db table");
        res.status(200).redirect('/');
    } catch (error) {
        console.log("Error in inserting data:", error);
        // Sending a server error status code
        res.status(500).send("Internal Server Error");
    }
};

  
