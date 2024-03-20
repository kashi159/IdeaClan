// import { DataTypes } from 'sequelize'
// import sequelize from '../utils/database.js';
const {  DataTypes } = require('sequelize')
const sequelize = require('../utils/database');

 const Book = sequelize.define('Book', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  author: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  owner: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  borrowRequestedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
  }
});

module.exports = Book;