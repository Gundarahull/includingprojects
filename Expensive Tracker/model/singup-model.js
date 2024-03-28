
const { DataTypes } = require('sequelize')
const sequelize=require('../util/database')


const SignUp=sequelize.define('signup',{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    username:{
        type:DataTypes.STRING,
        allowNull:false
    },
    email:{
        type:DataTypes.STRING,
        allowNull:false
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false
    },
    ispremium:{
        type:DataTypes.BOOLEAN,
        defaultValue: false
    },
    totalexpense:{
        type:DataTypes.INTEGER,
        // allowNull:false
    }
},{tableName:'signups'})

module.exports=SignUp