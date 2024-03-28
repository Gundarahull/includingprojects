// const { DataTypes } = require("sequelize");
// const sequelize = require("../util/database");

// //here we are going to crete another table fot categorized the products such as electronics,cosmotiecs like that
// const Category= sequelize.define('Category',{
//     id:{
//         type:DataTypes.INTEGER,
//         autoIncrement:true,
//         primaryKey:true,
//         allowNull:false
//     },
//     title:{
//         type:DataTypes.STRING,
//         allowNull:false
//     },
//     description:{
//         type:DataTypes.STRING,
//         allowNull:false
//     }
// },{tableName:'Categorys'})

// module.exports = Category


//importing the database to the table model
const { DataTypes } = require('sequelize')
const sequelize = require('../util/database')

const Category = sequelize.define('category', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    }

}, { tableName: 'Categorys' })

module.exports = Category
