const {DataTypes, UUID} = require('sequelize')
const sequelize = require('../config/db')
const Category = require('./Category')
const OrderItem = require('./Order_item')
const Review = require('./Review')

const Book = sequelize.define("Book", {
  id_book : {
    type : DataTypes.INTEGER,
    primaryKey : true,
    autoIncrement : true,
  },
  title : {
    type : DataTypes.STRING(150),
    allowNull : false
  },
  author : {
    type : DataTypes.STRING(200),
    allowNull : false,
  },
  description : {
    type : DataTypes.TEXT
  },
  category_id : {
    type : DataTypes.INTEGER,
    allowNull : false,
    references : {
      model : Category,
      key : "id_category"
    },
  },
  price_cents : { 
    type : DataTypes.INTEGER,
    allowNull : false
  },
  stock : {
    type : DataTypes.INTEGER,
    defaultValue : 0,
  },
  cover_path : {
    type : DataTypes.TEXT,
    allowNull : false,
  },
},
{
  tableName : "books",
  timestamps : true,
  paranoid : true,
}
)
Book.belongsTo(Category, {foreignKey : "category_id", as : "category"})
Book.belongsTo((OrderItem, {foreignKey : "order_item_id", as : "order_item"}))
Book.hasMany(Review, {foreignKey : "book_id", as : "review"})
module.exports = Book