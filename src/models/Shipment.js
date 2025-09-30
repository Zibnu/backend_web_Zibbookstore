const { DataTypes } = require('sequelize')
const sequelize = require('../config/db')
const Addres = require('./Addres');

const Shipment = sequelize.define('Shipment', {
  id : {
    type : DataTypes.UUID,
    primaryKey : true,
    defaultValue : DataTypes.UUIDV4
  },
  addres_id : {
    type : DataTypes.UUID,
    allowNull : false,
    references : {
      model : Addres,
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
  timestamps : true,
}
);
Shipment.belongsTo(Addres, {foreignKey : "id"}),

module.exports = Shipment