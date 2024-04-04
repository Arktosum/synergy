const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

app.use(express.json());
app.use(cors());
const userRouter = require("./routes/userRoutes");
const authRouter = require("./routes/authRoutes");

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

app.get("/", (req, res) => {
  res.send("<h1>Welcome to the backend!</h1>");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server online! : http://localhost:${PORT}`);
});
