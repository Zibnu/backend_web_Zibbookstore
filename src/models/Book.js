module.exports = (sequelize, DataTypes) => {
  const Book = sequelize.define("Book", {
    id_book: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "categories",   // nama tabel parent
        key: "id_category",
      },
    },
    price_cents: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    stock: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    cover_path: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  }, {
    modelName : "Book",
    tableName: "books",
    timestamps: true,
    paranoid: true,
  });

  // definisi relasi
  Book.associate = (models) => {
    Book.belongsTo(models.Category, { foreignKey: "category_id", as: "category" });
    Book.hasMany(models.OrderItem, { foreignKey: "book_id", as: "order_items" });
    Book.hasMany(models.Review, { foreignKey: "book_id", as: "reviews" });
    Book.hasMany(models.Cart, { foreignKey : "book_id", as : "carts"});
  };

  return Book;
};
