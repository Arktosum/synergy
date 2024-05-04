const express = require("express");
const dotenv = require("dotenv");
const path = require("path");

const envPath = path.resolve(__dirname, "../.env"); // Specify your custom path here
dotenv.config({ path: envPath });
dotenv.config();
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");

app.use(cors());
app.use(express.json());

app.use("/api/users", userRouter);
app.use("/api/finance", financeRouter);
app.use("/api/friend", friendRouter);

mongoose
  .connect(process.env.MONGODB_URI)
  .then((data) => console.log("MongoDB connected", data.connection.host))
  .catch((err) => console.error("MongoDB connection error:", err));

// app.use('/users', userRouter);

app.get("/", (req, res) => {
  res.send("<h1>Welcome to the backend!</h1>");
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
