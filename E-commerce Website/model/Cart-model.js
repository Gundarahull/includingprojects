const { DataTypes } = require('sequelize')
const sequelize = require('../util/database')

const Cart = sequelize.define('cart', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
    }
}, { tableName: 'carts' })

module.exports = Cart
