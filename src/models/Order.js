const { DataTypes } = require('sequelize')
const sequelize = require('../config/db')
const User = require('./User')
const OrderItem = require('./Order_item')

const Order = sequelize.define("Oders", {
  id_order : {
    type : DataTypes.INTEGER,
    primaryKey : true,
    autoIncrement: true,
  },
  user_id : {
    type : DataTypes.INTEGER,
    allowNull : false,
    references : {
      model : User,
      key : "id_user"
    }
  },
  total_cents : {
    type : DataTypes.INTEGER,
    allowNull : false
  },
  status : {
    type : DataTypes.STRING(20),
    defaultValue : 'paid',
    validate : {
      isIn : [["pending", "paid", "canceled" ]]
    }
  },
},
{
  tableName : "orders",
  timestamps : true,
  paranoid : true
}
)
Order.hasMany(OrderItem, {foreignKey : "order_id", as : "order_item"})
Order.belongsTo(User, {foreignKey : "user_id", as : "user"})
module.exports = Order