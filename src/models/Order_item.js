module.exports = (sequelize, DataTypes) => {
  const OrderItem = sequelize.define(
    "OrderItem",
    {
      id_order_items: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      order_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "orders",
          key: "id_order",
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
      price_cent: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
    },
    {
      modelName : "OrderItem",
      tableName: "order_items",
      timestamps: true,
      paranoid: true,
    }
  );
  OrderItem.associate = (models) => {
    OrderItem.belongsTo(models.Book, { foreignKey: "book_id", as: "book" });
    OrderItem.belongsTo(models.Order, { foreignKey: "order_id", as: "order" });
  };
  return OrderItem;
};
