const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");
const Shipment = require("./Shipment");
const Addres = sequelize.define(
  "Addres",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      references: {
        model: User,
        key: "id",
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
    timestamps: false,
  }
);

Addres.belongsTo(User, { foreignKey: "user_id" });
Addres.hasMany(Shipment)
module.exports = Addres;
