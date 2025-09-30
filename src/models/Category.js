const { DataTypes } = require('sequelize')
const sequelize = require('../config/db')
const Book = require("./Book")

const Category = sequelize.define('Category', {
  id : {
    type : DataTypes.INTEGER,
    defaultValue : DataTypes.UUIDV4,
    primaryKey : true,
  },
  name_category : {
    type : DataTypes.STRING(100),
    allowNull : false
  }
}, {
  tableName : "categories",
  timestamps : false
})
Category.hasMany(Book)
module.exports = Category