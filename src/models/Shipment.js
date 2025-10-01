const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Addres = require("./Address");

const Shipment = sequelize.define(
  "Shipment",
  {
    id_shipment: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    addres_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Addres,
        key: "id_address",
      },
    },
    status: {
      type: DataTypes.STRING(20),
      defaultValue: "processing",
      validate: {
        isIn: [["processing", "shipped", "delivery", "canceled"]],
      },
    },
  },
  {
    tableName: "shipments",
    timestamps: true,
    paranoid: true,
  }
);
Shipment.belongsTo(Addres, { foreignKey: "id", as: "addres" }),
  (module.exports = Shipment);
