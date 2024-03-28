const { DataTypes } = require("sequelize");
const sequelize = require("../util/database");

const Signup=sequelize.define('signup',{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    userId:{
        type:DataTypes.STRING,
        allowNull:false
    },
    username:{
        type:DataTypes.STRING,
        allowNull:false
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false
    },
    email:{
        type:DataTypes.STRING,
        unique:true,
        validate:{isEmail: true}
    },
},{tableName:'signups'})

module.exports=Signup