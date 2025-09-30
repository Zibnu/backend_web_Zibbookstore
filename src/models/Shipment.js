const { DataTypes } = require('sequelize')
const sequelize = require('../config/db')
const Order = require('./Order')

const Shipment = sequelize.define('Shipment', {
  id : {
    type : DataTypes.UUID,
    primaryKey : true,
    defaultValue : DataTypes.UUIDV4
  },
  order_id : {
    type : DataTypes.UUID,
    allowNull : false,
    references : {
      model : Order,
      key : "id",
    },
  },
  status : {
    type : DataTypes.STRING(20),
    defaultValue : "processing",
    validate : {
      isIn : [["processing", "shipped", "delivery", "canceled"]],
    }
  }
}, {
  tableName : "shipments",
  timestamps : false,
}
);
Shipment.belongsTo(Order, {foreignKey : "id"}),

module.exports = Shipment