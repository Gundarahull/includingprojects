const { DataTypes } = require("sequelize");
const sequelize = require("../util/database");


const Order=sequelize.define('orders',{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    paymentid:{
        type:DataTypes.STRING,
        allowNull:false
    },
    orderid:{
        type:DataTypes.STRING,
        allowNull:false
    },
    status:{
        type:DataTypes.STRING,
        allowNull:false
    }
},{tableName:'orders'})

module.exports=Order