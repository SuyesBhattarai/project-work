// Database configuration - connects to MongoDB
// Database connection file
const { Sequelize } = require("sequelize");
require('dotenv').config({ path: __dirname + '/../.env' }); 

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || "postgres",
    logging: false,
  }
);

module.exports = sequelize;