module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define(
    "Review",
    {
      id_review: {
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
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      comment: {
        type: DataTypes.TEXT,
      },
    },
    {
      modelName : "Review",
      tableName: "reviews",
      timestamps: true,
      paranoid: true,
    }
  );
  // Relasi
  Review.associate = (models) => {
    Review.belongsTo(models.User, { foreignKey: "user_id", as: "user" }),
    Review.belongsTo(models.Book, { foreignKey: "book_id", as: "book" });
  };
  return Review;
};
