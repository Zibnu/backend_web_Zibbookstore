module.exports = (sequelize, DataTypes) => {
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
      modelName : "User",
      tableName: "users",
      timestamps: true,
      paranoid: true,
    }
  );
  User.associate = (models) => {
    User.hasMany(models.Address, { foreignKey: "user_id", as: "adresses" });
    User.hasMany(models.Review, { foreignKey: "user_id", as: "reviews" });
    User.hasMany(models.Order, { foreignKey: "user_id", as: "orders" });
    User.hasMany(models.Payment, { foreignKey: "user_id", as: "payments"});
    User.hasMany(models.Cart, {foreignKey : "user_id", as : "carts"});
  };
  return User;
};
