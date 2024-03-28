const { DataTypes } = require('sequelize')
const sequelize = require('../util/database')

const CartItem = sequelize.define('cartitem', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    quantity:{
        type:DataTypes.INTEGER,
        allowNull:false
    }

}, { tableName: 'cartitems' })

module.exports = CartItem
