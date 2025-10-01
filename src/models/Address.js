const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");
const Shipment = require("./Shipment");
const Address = sequelize.define(
  "Address",
  {
    id_addres: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id_user",
      },
    },
    full_name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    street: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    postal_code: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    provinces: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  },
  {
    tableName: "addres",
    timestamps: true,
    paranoid : true
  }
);

Address.belongsTo(User, { foreignKey: "user_id", as : "user" });
Address.hasMany(Shipment, { foreignKey : "shipment_id", as : "shipment"})
module.exports = Address;
