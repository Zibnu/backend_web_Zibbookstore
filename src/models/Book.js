const {DataTypes, UUID} = require('sequelize')
const sequelize = require('../config/db')
const Category = require('./Category')

const Book = sequelize.define("Book", {
  id : {
    type : DataTypes.UUID,
    defaultValue : DataTypes.UUIDV4,
    primaryKey : true
  },
  title : { type : DataTypes.STRING(150), allowNull : false},
  author : { type : DataTypes.STRING(200)},
  description : {
    type : DataTypes.TEXT
  },
  category_id : {
    type : DataTypes.INTEGER,
    allowNull : false,
    references : {
      model : Category,
      key : "id"
    },
  },
  price_cents : { 
    type : DataTypes.INTEGER,
    allowNull : false
  },
  stock : {
    type : DataTypes.INTEGER,
    defaultValue : 0
  },
  cover_path : {
    type : DataTypes.TEXT
  },
  created_at : {
    type : DataTypes.TIME,
    defaultValue : DataTypes.NOW
  },
},
{
  tableName : "books",
  timestamps : false
}
)
Book.belongsTo(Category, {foreignKey : "id"})
Category.hasMany(Book)
module.exports = Book