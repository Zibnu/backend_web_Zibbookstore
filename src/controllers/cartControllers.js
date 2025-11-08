const { Cart, Book, sequelize } = require("../models");
// ✔️🔥
exports.getCart = async (req, res) => {
  try {
    const userId = req.user.id_user;

    const cart = await Cart.findAll({
      where : { user_id : userId},
      include : [
        {
          model : Book,
          as : "book",
          paranoid : false,
          attributes : ["id_book", "title", "author", "price_cents", "cover_path"],
          order : [["id_book" , "ASC"]]
        },
      ],
      order : [["id_cart", "ASC"]]
    });

    return res.status(200).json({
      success : true,
      message : "Get Cart Success",
      data : cart,
    });
  } catch (error) {
    console.error("Get Cart ERROR", error);
    return res.status(500).json({
      success : false,
      message : "Internal Server ERROR",
      error : error.message,
    });
  }
};
// ✔️🔥
exports.addToCart = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const userId = req.user.id_user;
    const { book_id, quantity } = req.body;

    if(!book_id) {
      await transaction.rollback();
      return res.status(400).json({
        success : false,
        message : "Book Required",
      });
    }

    const book = await Book.findByPk(book_id);
    if(!book) {
      await transaction.rollback();
      return res.status(404).json({
        success : false,
        message : "Book Not Found",
      });
    }

    const existingCart = await Cart.findOne({
      where : { user_id : userId, book_id},
      order : [["id_cart", "ASC"]]
    });

    if(existingCart) {
      existingCart.quantity += quantity || 1;
      await existingCart.save({ transaction });
    } else {
      await Cart.create(
        {
          user_id : userId,
          book_id,
          quantity : quantity || 1
        },
        { transaction }
      );
    }

    await transaction.commit();
    return res.status(201).json({
      success : true,
      message : "Book add to carts Success",
    });
  } catch (error) {
    if(!transaction.finished ){
      await transaction.rollback();
    }
    console.error("Add To Cart ERROR", error);
    return res.status(500).json({
      success : false,
      message : "Internal Server ERROR",
      error : error.message,
    });
  }
};
// ✔️🔥
exports.updateQuantity = async ( req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const userId = req.user.id_user;
    const { id_cart } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findOne({
      where : { id_cart, user_id : userId},
    });

    if(!cart) {
      await transaction.rollback();
      return res.status(404).json({
        success : false,
        message : "Cart Not Found",
      });
    }

    if( quantity < 1) {
      await transaction.rollback();
      return res.status(400).json({
        success : false,
        message : "Quantity must be at least 1",
      });
    }

    cart.quantity = quantity;
    await cart.save({ transaction });
    await transaction.commit();

    return res.status(200).json({
      success : true,
      message : "Cart Quantity Updated",
    });
  } catch (error) {
    if(!transaction.finished){
      await transaction.rollback();
    }
    console.error("Update Quantity ERROR", error);
    return res.status(500).json({
      success : false,
      message : "Internal Server ERROR",
      error : error.message,
    });
  }
};
// ✔️🔥
exports.removeFromCart = async ( req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const userId = req.user.id_user;
    const { id_cart } = req.params;

    const cart = await Cart.findOne({
      where : {id_cart, user_id : userId},
    });

    if(!cart) {
      await transaction.rollback();
      return res.status(404).json({
        success : false,
        message : "Cart item Not Found",
      });
    }

    await cart.destroy({ transaction });
    await transaction.commit();

    return res.status(200).json({
      success : true,
      message : "Cart Item Removed",
    });
  } catch (error) {
    if(!transaction.finished){
      await transaction.rollback();
    }
    console.error("Remove Item Cart ERROR", error);
    return res.status(500).json({
      success : false,
      message : "Internal Server ERROR",
      error : error.message,
    });
  }
};
// ✔️🔥
exports.clearCart = async ( req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const userId = req.user.id_user;

    const checkCart = await Cart.findOne({
      where : { user_id : userId},
    });

    if(!checkCart) {
      return res.status(400).json({
        success : false,
        message : "Chart Is Already Empty",
      });
    }

    await Cart.destroy({
      where : { user_id : userId },
      transaction,
    });

    await transaction.commit();
    return res.status(200).json({
      success : true,
      message : "All cart items cleared",
    });
  } catch (error) {
    if(!transaction.finished){
      await transaction.rollback();
    }
    console.error("Clear Cart ERROR", error);
    return res.status(500).json({
      success : false,
      message : "Internal Server ERROR",
      error : error.message,
    });
  }
};