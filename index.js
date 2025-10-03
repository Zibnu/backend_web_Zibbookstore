const express = require("express");
const app = express();
require("dotenv").config();

// middleware
app.use(express.json({}));
app.use(express.urlencoded({ extended : true}))
// Routes
const autRoutes = require("./src/routes/authRouter");
const bookRoutes = require("./src/routes/bookRouter");
app.use('/api/auth', autRoutes);
app.use('/api/books', bookRoutes);

// Testing models
// const dbTest = require("./src/models");
// console.log("Available Models:", Object.keys(dbTest));
// console.log("Order Model:", dbTest.Order);
// console.log("OrderItem Model:", dbTest.OrderItem);

// path welcome
app.get("/", (req, res) => {
  res.json({ pesan: "Welcome" });
});


const PORT = process.env.PORT;
app.listen(PORT, () => console.log("Server is Running"));
