const express = require("express");
const app = express();
require("dotenv").config();

app.use(express.json({}));

const PORT = process.env.PORT;
// Routes
app.get("/", (req, res) => {
  res.json({ pesan: "Welcome" });
});
const autRoutes = require("./src/routes/authRouter");
app.use('/auth', autRoutes);

// Testing models
const db = require("./src/models");
console.log("Available Models:", Object.keys(db));
console.log("Order Model:", db.Order);
console.log("OrderItem Model:", db.OrderItem);

app.listen(PORT, () => console.log("Server is Running"));
