
const { DataTypes } = require("sequelize");
const sequelize = require("../util/database");
const { v4: uuidv4 } = require('uuid');

const Forget = sequelize.define('forgots', {
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey: true,
    },
    uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4 // Using Sequelize's built-in UUIDV4 generator
    },
    userid: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    isactive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false
    }
}, { tableName: 'forgots' });

module.exports = Forget;
