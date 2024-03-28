const { Sequelize } = require("sequelize");

//connecting the database using sequelize
const sequelize=new Sequelize('revison' ,'root','rabiya',
{
    dialect:'mysql',
    host:'localhost'
})

module.exports=sequelize
