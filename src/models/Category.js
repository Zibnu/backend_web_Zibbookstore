const { DataTypes } = require('sequelize')
const sequelize = require('../config/db')
const Book = require("./Book")

const Category = sequelize.define('Category', {
  id_category : {
    type : DataTypes.INTEGER,
    primaryKey : true,
    autoIncrement : true,
  },
  name_category : {
    type : DataTypes.STRING(100),
    allowNull : false
  }
}, {
  tableName : "categories",
  timestamps : true,
  paranoid : true
})
Category.hasMany(Book, {foreignKey : "book_id", as : "book"})
module.exports = Category