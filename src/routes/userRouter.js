const express = require("express");
const router = express.Router();
const userControllers = require("../controllers/userControllers");
const { authenticate, isAdmin } = require("../middleware/authMiddleware");

// Route User
router.get("/myProfile", authenticate, userControllers.getMyProfile);
router.put("/update", authenticate, userControllers.updateProfile);
router.patch("/update/password", authenticate, userControllers.updatePassword);
router.delete("/delete", authenticate, userControllers.deleteAccount);

// Router Admin
router.get("/admin/", authenticate, isAdmin, userControllers.getAllUsers);
router.get("/admin/:id", authenticate, isAdmin, userControllers.getUserById);

module.exports = router;
