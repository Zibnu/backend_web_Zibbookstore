const express = require("express");
const router = express.Router();
const reviewControllers = require("../controllers/reviewControllers");
const { authenticate } = require("../middleware/authMiddleware");

// Router Publik
router.get("/book/:book_id", reviewControllers.getReviewsByBook);

// Router User
router.post("/create", authenticate, reviewControllers.createReview);
router.get("/my-review", authenticate, reviewControllers.getMyReview);
router.put("/edit/:id", authenticate, reviewControllers.updateReview);
router.delete("/delete/:id", authenticate, reviewControllers.deleteReview);

module.exports = router