const { DataTypes } = require('sequelize')
const sequelize = require('../config/db')
const User = require('./User')
const OrderItem = require('./Order_item')

const Order = sequelize.define("Oders", {
  id : {
    type : DataTypes.UUID,
    primaryKey : true,
    defaultValue : DataTypes.UUIDV4,
  },
  user_id : {
    type : DataTypes.UUID,
    allowNull : false,
    references : {
      model : User,
      key : "id"
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
  timestamps : false
}
)
Order.hasMany(OrderItem)
Order.belongsTo(User, {foreignKey : "user_id"})
module.exports = Order