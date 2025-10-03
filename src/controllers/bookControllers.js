const { Book, Category, Review, User } = require("../models");
const { Op, Association } = require("sequelize");

// get All books✔️
exports.getAllBooks = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      search,
      category_id,
      minPrice,
      maxPrice,
      sortBy = "createdAt",
      order = "DESC",
      inStock,
    } = req.query;

    // Build filter conditions
    const where = {};

    // search by title or author
    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { author: { [Op.iLike]: `%${search}%` } },
      ];
    }

    // Filter by category
    if (category_id) {
      where.category_id = category_id;
    }

    // filter by price range
    if (minPrice || maxPrice) {
      where.price_cents = {};
      if (minPrice) where.price_cents[Op.gte] = parseInt(minPrice);
      if (maxPrice) where.price_cents[Op.lte] = parseInt(maxPrice);
    }

    // filter by stock Available
    if (inStock === "true") {
      where.stock = { [Op.gt]: 0 };
    }

    // Pagenation
    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Query
    const { count, rows } = await Book.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      order: [[sortBy, order]],
      include: [
        {
          model: Category,
          as : "category",
          attributes: ["id_category", "name_category"],
        },
        {
          model: Review,
          as : "reviews",
          attributes: ["rating"],
          separate: true,
        },
      ],
      distinct: true,
    });
    // calculate averagre rating for each book
    const booksWithRating = rows.map((book) => {
      const bookData = book.toJSON();
      if (bookData.reviews && bookData.reviews.length > 0) {
        const totalRating = bookData.reviews.reduce(
          (sum, review) => sum + review.rating,
          0
        );
        bookData.averageRating = (
          totalRating / bookData.reviews.length
        ).toFixed(1);
        bookData.totalReviews = bookData.reviews.length;
      } else {
        bookData.averageRating = 0;
        bookData.totalReviews = 0;
      }

      delete bookData.reviews; //Remove reviews array from response
      return bookData;
    });

    return res.status(200).json({
      success: true,
      data: {
        books: booksWithRating,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / parseInt(limit)),
          totalItems: count,
          itemsPerPage: parseInt(limit),
        },
      },
    });
  } catch (error) {
    console.error("GetALLBooks Error", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server error",
      error: error.message,
    });
  }
};

// Get book by Id ( detail Page)✔️👍
exports.getBookId = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await Book.findByPk(id, {
      include: [
        {
          model: Category,
          as : "category",
          attributes: ["id_category", "name_category"],
        },
        {
          model: Review,
          as : "reviews",
          attributes: ["id_review", "rating", "comment", "createdAt"],
          include: [
            {
              model: User,
              as : "user",
              attributes: ["id_user", "username"],
            },
          ],
        },
      ],
    });

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book Not Found",
      });
    }

    // Calculate average rating
    const bookData = book.toJSON();
    if (bookData.reviews && bookData.reviews.length > 0) {
      const totalRating = bookData.reviews.reduce(
        (sum, review) => sum + review.rating,
        0
      );
      bookData.averageRating = (totalRating / bookData.reviews.length).toFixed(
        1
      );
      bookData.totalReviews = bookData.reviews.length;
    } else {
      bookData.averageRating = 0;
      bookData.totalRating = 0;
    }

    return res.status(200).json({
      success: true,
      data: bookData,
    });
  } catch (error) {
    console.error("Get Book Id Error", error);
    return res.status(500).json({
      success: false,
      message: "internal server error",
      error: error.message,
    });
  }
};

// Admin Only
// Create Book ✔️👍
exports.createBook = async (req, res) => {
  try {
    console.log("method", req.method, "url", req.originalUrl);
    console.log("req.body", req.body);
    console.log("req.file", req.file &&  req.file.filename);
    const {
      title,
      author,
      description,
      category_id,
      price_cents,
      stock,
    } = req.body;

    // validation if your input null
    if (
      !title ||
      !author ||
      !description ||
      !category_id ||
      !price_cents ||
      !stock 
    ) {
      return res.status(400).json({
        success: false,
        message: "Required your input",
      });
    }

    // Check if category 404
    const category = await Category.findByPk(category_id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "category not found",
      });
    }

    let cover_url = null;
    if(req.file) {
      cover_url = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    }

    // create new book
    const newBook = await Book.create({
      title,
      author,
      description,
      category_id : parseInt(category_id),
      price_cents: parseInt(price_cents),
      stock: stock ? parseInt(stock) : 0,
      cover_path : cover_url,
    });

    // fetch Book with category
    const bookWithCategory = await Book.findByPk(newBook.id_book, {
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["id_category", "name_category"],
        },
      ],
    });

    return res.status(201).json({
      success: true,
      message: "book created succesful",
      data: bookWithCategory,
    });
  } catch (error) {
    console.error("Created book error:", error);
    return res.status(500).json({
      success: false,
      message: "internal Server error",
      error: error.message,
    });
  }
};

// Update Book ✔️👍
exports.updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      author,
      description,
      category_id,
      price_cents,
      stock,
    } = req.body;

    const book = await Book.findByPk(id);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book Not Found",
      });
    }
    // Upload file
    let cover_url = null;
    if(req.file) {
      cover_url = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    };

    // check if category 404
    if (category_id) {
      const category = await Category.findByPk(category_id);
      if (!category) {
        return res.status(404).json({
          success: false,
          message: "Category Not Found",
        });
      }
    }

    // Update Books
    await book.update({
      title: title || book.title,
      author: author || book.author,
      description: description !== undefined ? description : book.description,
      category_id: parseInt(category_id) || book.category_id,
      price_cents: price_cents ? parseInt(price_cents) : book.price_cents,
      stock: stock !== undefined ? parseInt(stock) : book.stock,
      cover_path: cover_url || book.cover_path,
    });

    // fetch update book with category
    const updateBook = await Book.findByPk(id, {
      include: [
        {
          model : Category,
          as : "category",
          attributes: ["id_category", "name_category"],
        },
      ],
    });

    return res.status(200).json({
      success: true,
      message: "Book Updated",
      data: updateBook,
    });
  } catch (error) {
    console.error("Update Book Error", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// Update Stock ✔️👍
exports.UpdateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;

    if (stock === undefined || stock === null) {
      return res.status(400).json({
        success: false,
        message: "Stock is required",
      });
    }

    const book = await Book.findByPk(id);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book Not Found",
      });
    }

    await book.update({ stock: parseInt(stock)});

    return res.status(200).json({
      success : true,
      message : "Stock Updated succesful",
      data : {
        id_book : book.id_book,
        title : book.title,
        stock : book.stock,
      },
    });
  } catch (error) {
    console.error("Updated Stock Error", error);
    return res.status(500).json({
      success : false,
      message : "Internal Server Error",
      error : error.message,
    });
  }
};

// deleted Book ✔️👍
exports.deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await Book.findByPk(id);
    if(!book) {
      return res.status(404).json({
        success : false,
        message : "Book not found",
      });
    }

    // Soft delete ( not Permanent , syarat Paranoid : true, restore() untuk mengembalikan data) 
    await book.destroy();

    return res.status(200).json({
      success : true,
      message : "Book deleted",
      data : {
        title : book.title
      }
    });
  } catch (error) {
    console.error("Deleted Book Error", error);
    return res.status(500).json({
      success : false,
      message : "Internal Server Error",
      error : error.message
    });
  }
}