const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryControllers");
const { authenticate, isAdmin} = require("../middleware/authMiddleware");

router.get("/", categoryController.getAllCategory);
router.get("/:id", categoryController.getCategoryById);

// Admin
router.get("/admin/stats", authenticate, isAdmin, categoryController.getCategoryWithStats);
router.post("/", authenticate, isAdmin, categoryController.createCategory);
router.put("/:id", authenticate, isAdmin, categoryController.updateCategory);
router.delete("/:id", authenticate, isAdmin, categoryController.deleteCategory);

module.exports = router;