const { Sequelize } = require("sequelize");

const sequelize = new Sequelize('instructor','root','rabiya',{
    dialect:'mysql',
    host:'localhost'
})
//exporting the connection to be used in other files  
module.exports=sequelize;