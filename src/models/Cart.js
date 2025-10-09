module.exports = (sequelize, DataTypes) => {
  const Cart = sequelize.define(
    "Cart",
    {
      id_cart: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id_user",
        },
      },
      book_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "books",
          key: "id_book",
        },
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue : 1,
      },
    },
    {
      modelName : "Cart",
      tableName: "carts",
      timestamps: true,
      paranoid: true,
    }
  );
  // Relasi
  Cart.associate = (models) => {
    Cart.belongsTo(models.User, { foreignKey: "user_id", as: "user" }),
    Cart.belongsTo(models.Book, { foreignKey: "book_id", as: "book" });
  };
  return Cart;
};
