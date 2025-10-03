const express = require("express");
const router = express.Router();
const bookControllers = require("../controllers/bookControllers");
const { authenticate , isAdmin } = require("../middleware/authMiddleware");

// Public route
router.get('/all', bookControllers.getAllBooks);
router.get('/:id', bookControllers.getBookId);

// protected
router.post('/create', authenticate, isAdmin, bookControllers.createBook);
router.put('/:id', authenticate, isAdmin, bookControllers.updateBook);
router.patch('/:id/stock', authenticate, isAdmin, bookControllers.UpdateStock);
router.delete('/:id', authenticate, isAdmin, bookControllers.deleteBook);

module.exports = router;