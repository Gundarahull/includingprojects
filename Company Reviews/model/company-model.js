const { DataTypes } = require("sequelize");
const sequelize = require('../util/database');

const Company=sequelize.define('company',{
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
        
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    pros: {
        type: DataTypes.STRING,
        allowNull: false
    },
    cons: {
        type: DataTypes.STRING,
        allowNull: false
    },
    rating:{
        type:DataTypes.BIGINT,
        allowNull:false
    }
},{tableName:'companys'})

module.exports=Company