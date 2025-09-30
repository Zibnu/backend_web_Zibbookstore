const { DataTypes } = require('sequelize')
const sequelize = require('../config/db')
const Order = require('./Order')
const Book = require('./Book')

const OrderItem = sequelize.define("OrderItem", {
  id : {
    type: DataTypes.UUID,
    defaultValue : DataTypes.UUIDV4,
    primaryKey : true
  },
  order_id : {
    type : DataTypes.UUID,
    allowNull : false,
    references : {
      model : Order,
      key : "id",
    }
  },
  book_id : {
    type : DataTypes.UUID,
    allowNull : false,
    references : {
      model : Book,
      key : "id"
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
  timestamps : false
}
)

OrderItem.belongsTo(Book, {foreignKey : "id"})
OrderItem.belongsTo(Order, { foreignKey : "id"})


module.exports = OrderItem