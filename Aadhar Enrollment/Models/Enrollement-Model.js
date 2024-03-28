
const { DataTypes } = require("sequelize");
const sequelize = require("../Util/database");


const Enroll=sequelize.define('enrollments',{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    age:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    houseno:{
        type:DataTypes.STRING,
        allowNull:false
    },
    street:{
        type:DataTypes.STRING,
        allowNull:false
    },
    city:{
        type:DataTypes.STRING,
        allowNull:false
    },
    district:{
        type:DataTypes.STRING,
        allowNull:false
    },
    postalcode:{
        type:DataTypes.STRING,
        allowNull:false
    },
    gender:{
        type:DataTypes.STRING,
        allowNull:false
    },
    dob:{
        type:DataTypes.STRING,
        allowNull:false
    },
    phonenumber:{
        type:DataTypes.BIGINT,
        allowNull:false
    },
    approve:{
        type:DataTypes.BOOLEAN,
        defaultValue: false
    }

},{tableName:'enrollments'})

module.exports=Enroll