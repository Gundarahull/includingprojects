const { where } = require("sequelize");
const Expensive = require("../model/expense-model");
const SignUp = require("../model/singup-model");
const data_exporter=require('json2csv').Parser


exports.leaderboard = (req, res) => {
    SignUp.findAll({
        attributes:['username','totalexpense'],
        order: [       ['totalexpense', 'DESC'] ]
    }).then(expenses=>{
        const viewdata = {
            expenses,
            pageTitle: "LEADERBOARD"
        };
        res.render('../views/premium/leaderboard', viewdata);
    })
    .catch(error => {
        console.error('Error occurred while fetching data:', error);
        res.status(500).send('Error occurred while fetching data');
    });
}

  