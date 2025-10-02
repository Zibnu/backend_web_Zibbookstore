const jwt = require("jsonwebtoken");
const { User } = require("../models");

const SECRET = process.env.SECRET_KEYS

// Veryfy token
exports.authenticate = async (req, res, next) => {
  try {
    // ambil token dari header Authorization
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success : false,
        message : "No Token Provided",
      });
    };

    const token = authHeader.split(" ")[1];//Bearer Token

    // Veryfy token
    const decoded = jwt.verify(token, SECRET);

    // Cek Apakah user masih ada dan Aktif
    const user = await User.findByPk(decoded.id_user);
    if(!user || !user.isActive) {
      return res.status(401).json({
        success : false,
        message : "Invalid token or user inactive",
      });
    };

    // Simpan user info ke req.user
    req.user = {
      id_user : user.id_user,
      email : user.email,
      role : user.role,
    };
    next();
  } catch (error) {
    if(error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success : false,
        message : "Invalid Token",
      });
    };
    if(error.name === "TokenExpiredError"){
      return res.status(401).json({
        success : false,
        message : "Token Expired",
      });
    };
    return res.status(500).json({
      success : false,
      message : "Auth Error",
      error : error.message
    });
  };
};
  // CHECK ADMIN
  exports.isAdmin = (req, res, next) => {
    if(req.user.role !== "admin"){
      return res.status(403).json({
          success : false,
          message : "Access denied. admin only",
      });
    };
    next();
  };

  // Check User or Admin
  exports.isUserOrAdmin = (req, res, next) => {
    const requestedUserId = parseInt(req.params.userId || req.params.id_user);

    // Jika user yang login  adalah admin atau user yang sama
    if(req.user.role === "admin" || req.user.id_user === requestedUserId){
      return next();
    };
    return res.status(403).json({
      success : false,
      message : "Access Denied",
    });
  };