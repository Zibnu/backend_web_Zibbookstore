const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Addres = require("./Address.js");
const Review = require("./Review");
const Order = require("./Order");

const User = sequelize.define(
  "User",
  {
    id_user: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: true, //tidak boleh kosong mesikipun " "
      },
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
      },
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    role: {
      type: DataTypes.ENUM("user", "admin"),
      allowNull: false,
      defaultValue: "user",
    },
  },
  {
    tableName: "users",
    timestamps: true,
    paranoid: true,
  }
);
User.hasMany(Addres, { foreignKey: "user_id", as: "adresses" });
User.hasMany(Review, { foreignKey: "user_id", as: "reviews" });
User.hasMany(Order, { foreignKey: "user_id", as: "orders" });
module.exports = User;
