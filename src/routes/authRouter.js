const express = require("express")
const router = express.Router();
const Authcontroller = require("../controllers/authControllers");
const { authenticate } = require("../middleware/authMiddleware");

router.post('/register', Authcontroller.register);
router.post('/login', Authcontroller.login);

//protected
router.get('/profile', authenticate, Authcontroller.getProfile);

module.exports = router