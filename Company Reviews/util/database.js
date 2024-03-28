const { Sequelize } = require("sequelize");

const sequelize = new Sequelize('review','root','rabiya',{
    dialect:'mysql',
    host:'localhost'
})

module.exports=sequelize