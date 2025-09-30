const { DataTypes } = require('sequelize')
const sequelize = require('../config/db')

const Order = sequelize.define("Oders", {
  id : {
    type : DataTypes.UUID,
    primaryKey : true,
    defaultValue : DataTypes.UUIDV4,
  },
  total_cents : { type : DataTypes.INTEGER, allowNull : false},
  status : {
    type : DataTypes.STRING(20),
    defaultValue : 'paid',
    validate : {
      isIn : [["pending", "paid", "canceled" ]]
    }
  },
  // foreign key
  user_id : { type : DataTypes.UUID, allowNull : false},
  addres_id : { type : DataTypes.UUID, allowNull : false}
},
{
  tableName : "orders",
  timestamps : false
}
)
module.exports = Order