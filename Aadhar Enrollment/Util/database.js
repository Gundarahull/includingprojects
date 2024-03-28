const { Sequelize } = require("sequelize");

const sequelize= new Sequelize('aadhar','root','rabiya',{
    dialect:'mysql',
    host:'localhost'
})

module.exports=sequelize 