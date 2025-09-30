const { DataTypes } = require('sequelize')
const sequelize = require('../config/db')

const Category = sequelize.define('Category', {
  id : {
    type : DataTypes.UUID,
    defaultValue : DataTypes.UUIDV4,
    primaryKey : true,
  },
  name_category : { type : DataTypes.STRING(100), allowNull : false}
}, {
  tableName : "categories",
  timestamps : false
})
module.exports = Category