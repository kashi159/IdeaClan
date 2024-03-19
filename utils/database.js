// const Sequelize = require('sequelize');
import Sequelize from 'sequelize';
// require('dotenv').config();
import dotenv from 'dotenv';
dotenv.config();

const sequelize = new Sequelize(process.env.DB_NAME , process.env.DB_USER , process.env.DB_PASSWORD , {
    dialect: 'mysql',
    host: process.env.DB_HOST_NAME,
    port: process.env.DB_PORT,
    timezone: '+05:30', // Set the timezone offset for the database connection
})
export default sequelize;
// module.exports = sequelize;