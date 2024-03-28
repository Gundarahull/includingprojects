const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../util/database");

const Logs=sequelize.define('logs',{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    logintime:{
        type:DataTypes.STRING,
        allowNull:false
    },
    logouttime:{
        type:DataTypes.STRING,
        allowNull:true
    },
    date:{
        type:DataTypes.STRING,
        allowNull:false
    },
    month:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    year:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
},{tableName:'logs'})

module.exports=Logs