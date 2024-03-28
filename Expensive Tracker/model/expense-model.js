const { DataTypes } = require("sequelize");
const sequelize = require("../util/database");


const Expensive=sequelize.define('expenses',{
    id:{
        
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    amount:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    description:{
        type:DataTypes.STRING,
        allowNull:false
    },
    category:{
        type:DataTypes.STRING,
        allowNull:false
    }
},{tableName:'expenses'})

module.exports=Expensive