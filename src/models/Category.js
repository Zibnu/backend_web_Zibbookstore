module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define(
    "Category",
    {
      id_category: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name_category: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
    },
    {
      modelName : "Categry",
      tableName: "categories",
      timestamps: true,
      paranoid: true,
    }
  );
  Category.associate = (models) => {
    Category.hasMany(models.Book, { foreignKey: "category_id", as: "books" });
  };
  return Category;
};
