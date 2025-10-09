const { User, Review, Address, Order, sequelize } = require("../models");
const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
// ✔️👏
exports.getMyProfile = async (req, res) => {
  try {
    const userId = req.user.id_user;

    const user = await User.findByPk(userId, {
      attributes : ["id_user", "username", "email", "role", "createdAt"],
      include : [
        {
          model : Address,
          as : "adresses",
          attributes : ["id_address", "phone", "street", "provinces","postal_code"],
        },
      ],
    });

    if(!user) {
      return res.status(404).json({
        success : false,
        message : "User Not Found",
      });
    }

    return res.status(200).json({
      success : true,
      data : user,
    });
  } catch (error) {
    console.error("Get My Profile ERROR", error);
    return res.status(500).json({
      success : false,
      message : "Internal Server ERROR",
      error : error.message,
    });
  }
};
// ✔️👏
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id_user;
    const { username, email } = req.body;

    const user = await User.findByPk(userId);
    
    if(!user) {
      return res.status(404).json({
        success : false,
        message : "User Not Found",
      });
    }

    await user.update({
      username : username || user.username,
      email : email || user.email,
    });

    const userResponse = {
      id_user : userId,
      username : user.username,
      email : user.email,
    }

    return res.status(200).json({
      success : true,
      message : "Profile Updated",
      data : userResponse,
    });
  } catch (error) {
    console.error("Update Profile ERROR", error);
    return res.status(500).json({
      success : false,
      message : "Internal Server Error",
      error : error.message,
    });
  }
};
// ✔️🔥
exports.updatePassword = async (req, res) => {
  try {
    const userId = req.user.id_user;
    const { oldPassword, newPassword } = req.body;

    if(!oldPassword || !newPassword) {
      return res.status(400).json({
        success : false,
        message : "Your Input is Null",
      });;
    }
    
    const user = await User.findByPk(userId);
    if(!user) {
      return res.status(404).json({
        success : false,
        message : "User Not Found",
      });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if(!isMatch) {
      return res.status(400).json({
        success : false,
        message : "Old Password is Incorrect",
      });
    }

    const hashPassword = await bcrypt.hash(newPassword, 10);
    await user.update({ password : hashPassword });

    return res.status(201).json({
      success : true,
      message : "Update Password Success",
    });
  } catch (error) {
    console.error("Update Password ERROR", error);
    return res.status(500).json({
      success : false,
      message : "Internal Server Error",
      error : error.message,
    });
  }
};
// ✔️🔥
exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id_user;

    const user = await User.findByPk(userId);
    if(!user) {
      return res.status(404).json({
        success : false,
        message : "User Not Found",
      });
    }

    await user.destroy();

    return res.status(200).json({
      success : true,
      message : "Delete Account Success",
    });
  } catch (error) {
    console.error("Delete Account ERROR", error);
    return res.status(500).json({
      success : true,
      message : "Internal Server Error",
      error : error.message,
    });
  }
};

// Admin ✔️🔥
exports.getAllUsers = async (req, res) => {
  try {
    const { page =1, limit = 10, search } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if(search) {
      where.username = { [Op.iLike] : `%${search}%`};
    }

    const { count, rows : users } = await User.findAndCountAll({
      where,
      limit : parseInt(limit),
      offset,
      order : [["createdAt", "DESC"]],
      attributes : ["id_user", "username", "email", "role", "createdAt"],
    });

    return res.status(200).json({
      success : true,
      Data : {
        users,
        pagination : {
          currentPage : parseInt(page),
          totalPages : Math.ceil( count / parseInt(limit)),
          totalItems : count,
          itemsPerPage : parseInt(limit),
        },
      },
    });
  } catch (error) {
    console.error("Get All User ERROR", error);
    return res.status(500).json({
      success : false,
      message : "Internal Server ERROR",
      error : error.message,
    });
  }
};
// ✔️🔥
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk( id, {
      attributes : ["id_user", "username", "email", "role", "createdAt"],
      include : [
        {
          model : Order,
          as : "orders",
          attributes : ["id_order", "total_cents", "status", "createdAt"],
        },
        {
          model : Review,
          as : "reviews",
          attributes : ["id_review", "rating", "comment", "createdAt"],
        },
      ],
    });

    if(!user){
      return res.status(404).json({
        success : false,
        message : "User Not Found",
      });
    }

    return res.status(200).json({
      success : true,
      data : user,
    });
  } catch (error) {
    console.error("Get User By ID ERROR", error);
    return res.status(500).json({
      success : false,
      message : "Internal Server ERROR",
      error : error.message,
    });
  }
};