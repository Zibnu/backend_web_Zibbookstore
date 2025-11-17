const { Category, Book } = require("../models");
// ✔️👏 Menampilkan semua category 
exports.getAllCategory = async (req, res) => {
  try {
    const { inCludeBookCount } = req.query;

    let categories;

    if(inCludeBookCount === "true") {
      // get category with book count
      categories = await Category.findAll({
        attributes : [
          "id_category",
          "name_category",
          "createdAt",
          "updatedAt",
        ],
        include : [
          {
            model : Book,
            as : "books",
            attributes : ["id_book"],
            where : { stock : {[require("sequelize").Op.gt] : 0}},
            require : false,
          },
        ],
      });

      // Format Response with book count
      const categoriesWithCount = categories.map(category => {
        const categoryData = category.toJSON();
        categoryData.bookCount = categoryData.books ? categoryData.books.length : 0;
        delete categoryData.books;
        return categoryData;
      });
      return res.status(200).json({
        success : true,
        data : categoriesWithCount,
      });
    }else {
      // Simple list without book count
      categories = await Category.findAll({
        attributes : ["id_category", "name_category"],
        order : [["name_category", "ASC"]],
      });

      return res.status(200).json({
        success : true,
        data : categories,
      });
    }
  } catch (error) {
    console.error("Get All Category ERROR", error);
    return res.status(500).json({
      success : false,
      message : "Internal Server Error",
      error : error.message,
    });
  }
};
//cari kategory berdasarkan id dan dapat menampilkan data buku dengan query yang telah didefinisikan
// ✔️👏
exports.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const { includeBooks, page = 1, limit = 10} = req.query;

    const category = await Category.findByPk(id, {
      attributes : ["id_category", "name_category", "createdAt", "updatedAt"],
    });

    if(!category) {
      return res.status(404).json({
        success : false,
        message : "Category Not Found",
      });
    }

    if(includeBooks !== "true") {
      return res.status(200).json({
        success : true,
        data : category
      });
    }

    // if( includeBooks === "true") {
    //   category = await Category.findByPk(id,{
    //     include : [
    //       {
    //         model : Book,
    //         as : "books",
    //         attributes : [
    //           "id_book",
    //           "title",
    //           "author",
    //           "price_cents",
    //           "stock",
    //           "cover_path"
    //         ],
    //         where : { stock :{[require("sequelize").Op.gt] : 0}},
    //         required : false,
    //       },
    //     ],
    //   });
    // }else {
    //   category = await Category.findByPk(id, {
    //     attributes : ["id_category", "name_category", "createdAt", "updatedAt"],
    //   });
    // }

    // if(!category){
    //   return res.status(404).json({
    //     success : false,
    //     message : "category not found",
    //   });
    // }

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const Op = require("sequelize").Op;

    const {count, rows : books} = await Book.findAndCountAll({
      where : {
        category_id : id,
        stock : { [Op.gt] : 0},
      },
      limit : parseInt(limit),
      offset,
      order : [["createdAt", "DESC"]],
      attributes : [
        "id_book",
        "title",
        "author",
        "price_cents",
        "stock",
        "cover_path",
      ],
    });

    return res.status(200).json({
      success : true,
      data : {
        category,
        books,
        pagination : {
          currentPage : parseInt(page),
          totalPages : Math.ceil(count / parseInt(limit)),
          totalItems : count,
          itemsPerPage : parseInt(limit),
        },
      },
    });
  } catch (error) {
    console.error("Get Category by id ERROR", error);
    return res.status(500).json({
      success : false,
      message : "Internal Server Error",
      error : error.message,
    });
  }
};
// 👏✔️
exports.createCategory = async (req, res) => {
  try {
    const { name_category} = req.body;

    if(!name_category || name_category.trim() === "") {
      return res.status(400).json({
        success : false,
        message : "Your Input Category NULL",
      });
    }

    // Cek Kategory jika sudah ada ( case-sensitif)
    const exitingCategory = await Category.findOne({
      where : {
        name_category : {
          [require("sequelize").Op.iLike] : name_category.trim(),
        },
      },
    });
    if(exitingCategory) {
      return res.status(409).json({
        success : false,
        message : "Category Already Exits",
      });
    }

    // Create new Category
    const newCategory = await Category.create({
      name_category : name_category.trim(),//trim berfungsi untuk menghapus spasi diawal dan akhir
    });

    return res.status(201).json({
      success : true,
      message : "Category created succesful",
      data : newCategory,
    });
  } catch (error) {
    console.error("Create Category ERROR", error);
    return res.status(500).json({
      success : false,
      message : "Internal Server Error",
      error : error.message,
    });
  }
};

// 👏✔️
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name_category } = req.body;

    if(!name_category) {
      return res.status(400).json({
        success : false,
        message : "Your Input category is NULL",
      });
    }

    const category = await Category.findByPk(id);
    if(!category) {
      return res.status(404).json({
        success : false,
        message : "Category Not Found",
      });
    }

    const exitingCategory = await Category.findOne({
      where : {
        name_category : {
          [require("sequelize").Op.iLike] : name_category.trim(),
        },
        id_category : {
          [require("sequelize").Op.ne] : id,
        },
      },
    });

    if(exitingCategory) {
      return res.status(409).json({
        success : false,
        message : "Category name already exits",
      });
    }

    await category.update({
      name_category : name_category.trim(),
    });

    return res.status(200).json({
      success : true,
      message : "Category Updated succesful",
      data : category,
    });
  } catch (error) {
    console.error("Update Category ERROR", error);
    return res.status(500).json({
      success : false,
      message : "internal Server Error",
      error : error.message
    });
  }
};


// 👏✔️
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findByPk(id, {
      include : [
        {
          model : Book,
          as : "books",
          attributes : ["id_book"],
        },
      ],
    });

    if(!category) {
      return res.status(404).json({
        success : false,
        message : "Category Not Found",
      });
    }

    if(category.books && category.books.length > 0) {
      return res.status(400).json({
        success : false,
        message : "Cannot delete category with exiting books",
        detail : `This category has ${category.books.length} books. Please reassign or delete them first`,
      });
    }

    // Soft delete
    await category.destroy();

    return res.status(200).json({
      success : true,
      message : "Category deleted success",
    });
  } catch (error) {
    console.error("Delete Category ERROR", error);
    return res.status(500).json({
      success : false,
      message : "Internal Server Error",
      error : error.message
    })
  }
}
//Get data analisis untuk admin ✔️👏
exports.getCategoryWithStats = async ( req, res) => {
  try {
    const categories = await Category.findAll({
      attributes : ["id_category", "name_category", "createdAt"],
      include : [
        {
          model : Book,
          as : "books",
          attributes : ["id_book", "stock", "price_cents"],
        },
      ],
      order: [["name_category", "ASC"]],
    });

    const categoriesWithStats = categories.map(category => {
      const categoryData = category.toJSON();

        if(categoryData.books && categoryData.books.length > 0){
          categoryData.totalBooks = categoryData.books.length;
          categoryData.totalStock = categoryData.books.reduce(
            (sum, book) => sum + book.stock,
            0
          );
          categoryData.booksInStock = categoryData.books.filter(
            book => book.stock > 0
          ).length;
          categoryData.totalValue = categoryData.books.reduce(
            (sum, book) => sum + (book.price_cents * book.stock),
            0
          );
        }else {
          categoryData.totalBooks = 0;
          categoryData.totalStock = 0;
          categoryData.totalInStock = 0;
          categoryData.totalValue = 0;
        }

        delete categoryData.books; //menghapus buku dalam array
        return categoryData
        })

        return res.status(200).json({
          success : true,
          data : categoriesWithStats
        });
  } catch (error) {
    console.error("Get Category With Stats ERROR", error);
    return res.status(500).json({
      success : false,
      message : "Internal Server Error",
      error : error.message,
    });
  }
};