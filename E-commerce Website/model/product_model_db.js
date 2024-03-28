
//importing the database to the table model
const { DataTypes } = require('sequelize')
const sequelize=require('../util/database')

const Product=sequelize.define('product',{
    id:{
        type:DataTypes.BIGINT,
        autoIncrement:true,
        primaryKey:true
    },
    title:{
        type:DataTypes.STRING
    },
    description:{
        type:DataTypes.TEXT
    },
    price:{
        type:DataTypes.DOUBLE

    },
    imageurl:{
        type:DataTypes.TEXT,
        // allowNull:false
    }
},{tableName:'products'})

module.exports=Product
