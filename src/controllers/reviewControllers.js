const { Review, Book, User, sequelize, Order, OrderItem, Shipment } = require("../models");
const { Op } = require("sequelize");
// ✔️🔥
exports.createReview = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const userId = req.user.id_user;
    const { book_id, rating, comment } = req.body;

    if(!book_id || !rating ) {
      await transaction.rollback();
      return res.status(400).json({
        success : false,
        message : "Book Id and Rating Required",
      });
    }

    if(rating < 1 || rating > 5){
      await transaction.rollback();
      return res.status(400).json({
        success : false,
        message : "Rating must be 1 betwen 5",
      });
    }

    const book = await Book.findByPk(book_id);
    if(!book){
      await transaction.rollback();
      return res.status(404).json({
        success : false,
        message : "Book Not Found",
      });
    }

    // const purchased = await Order.findOne({
    //   where : {
    //     user_id : userId,
    //     status : "paid",
    //   },
    //   include : [
    //     {
    //       model : OrderItem,
    //       as : "orderItems",
    //       where : { book_id },
    //     },
    //   ],
    // });

    // if(!purchased) {
    //   return res.status(403).json({
    //     success : false,
    //     message : "You can Review when you buy this Book",
    //   });
    // }

    const existingReview = await Review.findOne({
      where : { book_id , user_id : userId },
    });

    if(existingReview) {
      await transaction.rollback();
      return res.status(400).json({
        success : false,
        message : "You have already reviewed this book",
      });
    }

    const review = await Review.create(
      {
        user_id : userId,
        book_id,
        rating,
        comment,
      },
      { transaction },
    );

    await transaction.commit();

    return res.status(201).json({
      success : true,
      message : "Review Created Succes",
      data : review,
    });
  } catch (error) {
    if(!transaction.finished){
      await transaction.rollback();
    };
    console.error("Create Review ERROR", error);
    return res.status(500).json({
      success : false,
      message : "Internal Server ERROR",
      error : error.message,
    });
  }
};
// ✔️🔥
exports.getReviewsByBook = async (req, res) => {
  try {
    const { book_id } = req.params;

    const reviews = await Review.findAll({
      where : { book_id },
      order : [["createdAt", "DESC"]],
      include : [
        {
          model : User,
          as : "user",
          attributes : ["id_user", "username"],
        },
        {
          model : Book,
          as : "book",
          attributes : ["id_book", "title", "author"],
        },
      ],
    });

    return res.status(200).json({
      success : true,
      data : reviews,
    });
  } catch (error) {
    console.error("Get Reviews By Book ERROR", error);
    return res.status(500).json({
      success : false,
      message : "Internal Server ERROR",
      error : error.message,
    });
  }
};
// ✔️🔥
exports.getMyReview = async (req, res) => {
  try {
    const userId = req.user.id_user;

    const reviews = await Review.findAll({
      where : {user_id : userId},
      order : [["createdAt", "DESC"]],
      include : [
        {
          model : Book,
          as : "book",
          attributes : ["id_book", "title", "cover_path"],
        },
      ],
    });

    return res.status(200).json({
      success : true,
      data : reviews,
    });
  } catch (error) {
    console.error("Get My Review ERROR", error);
    return res.status(500).json({
      success : false,
      message : "Internal Server ERROR",
      error : error.message,
    });
  }
};
// ✔️🔥
exports.updateReview = async (req, res) => {
  try {
    const userId = req.user.id_user;
    const { id } = req.params;
    const { rating, comment } = req.body;

    const review = await Review.findOne({
      where : { id_review : id, user_id : userId},
    });

    if(!review) {
      return res.status(404).json({
        success : false,
        message : "Review Not Found",
      });
    }

    if( rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({
        success : false,
        message : "Rating Must Be 1 Betwen 5",
      });
    }

    await review.update({
      rating : rating || review.rating,
      comment : comment !== undefined ? comment : review.comment,
    });

    return res.status(200).json({
      success : true,
      message : "Update Review Succes",
      data : review,
    });
  } catch (error) {
    console.error("Update Review ERROR", error);
    return res.status(500).json({
      success : false,
      message : "Internal Server Error",
      error : error.message,
    });
  }
};
// ✔️🔥
exports.deleteReview = async (req, res) => {
  try {
    const userId = req.user.id_user;
    const { id } = req.params;

    const review = await Review.findOne({
      where : { id_review : id, user_id : userId },
    });

    if(!review) {
      return res.status(404).json({
        success : false,
        message : "Review Not Found"
      });
    }

    await review.destroy();

    return res.status(200).json({
      success : true,
      message : "Delete Review Success",
    });
  } catch (error) {
    console.error("Delete Review ERROR", error);
    return res.status(500).json({
      success : false,
      message : "Internal Server ERROR",
      error : error.message,
    });
  }
};