const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const routes = require("./routes/routes");
const cors = require("cors");
const auth = require("./middlewares/auth");
const errors = require("./middlewares/error");
const Unless = require("express-unless");
const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(cors());
app.get("/", (req, res) => {
  res.send("Hello Ajay good morning");
});
mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => {
    console.log("mongo is connected...");
  })
  .catch((err) => {
    console.log(err);
  });

auth.authenticateToken.unless = Unless;
app.use(
  auth.authenticateToken.unless({
    path: [
      { url: "/api/login", methods: ["POST"] },
      { url: "/api/register", methods: ["POST"] },
    ],
  })
);
app.use("/api", routes);
app.use(errors);

app.listen(PORT, (req, res) => {
  console.log("Listing server... at port", PORT);
});
