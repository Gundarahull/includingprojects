const { Sequelize } = require("sequelize");

const connectDB = new Sequelize(process.env.DB_NAME , process.env.DB_USER, process.env.DB_PWD, {
  host: process.env.SERVER_NAME,
  dialect: process.env.DIALECT,
  /* one of 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle' */
});

module.exports = connectDB;
