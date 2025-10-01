const { DataTypes } = require('sequelize')
const sequelize = require('../config/db')
const Order = require('./Order')
const Book = require('./Book')

const OrderItem = sequelize.define("OrderItem", {
  id_order : {
    type: DataTypes.INTEGER,
    primaryKey : true,
    autoIncrement : true,
  },
  order_id : {
    type : DataTypes.INTEGER,
    allowNull : false,
    references : {
      model : Order,
      key : "id_order",
    }
  },
  book_id : {
    type : DataTypes.INTEGER,
    allowNull : false,
    references : {
      model : Book,
      key : "id_book"
    }
  },
  price_cent : {
    type : DataTypes.INTEGER,
    allowNull : false
  },
  quantity : {
    type : DataTypes.INTEGER,
    allowNull : false,
    defaultValue : 1
  },
},
{
  tableName : "order_items",
  timestamps : true,
  paranoid : true
}
)

OrderItem.belongsTo(Book, {foreignKey : "book_id", as : "book"})
OrderItem.belongsTo(Order, { foreignKey : "order_id", as : "Order"})


module.exports = OrderItem