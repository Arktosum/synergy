const express = require("express");
const dotenv = require("dotenv");
const path = require("path");

const envPath = path.resolve(__dirname, "../.env"); // Specify your custom path here
dotenv.config({ path: envPath });
dotenv.config();
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const userRouter = require("./routes/userRoutes");
const roomRouter = require("./routes/roomRoutes");
const messageRouter = require("./routes/messageRoutes");

app.use(cors());
app.use(express.json());
function errorHandler(err, req, res, next) {
  console.error(err.stack); // Log the error for debugging (optional)
  res.status(500).send(err.message); // Respond with a generic error message
}

app.use(errorHandler);
app.use("/api/users", userRouter);
app.use("/api/rooms", roomRouter);
app.use("/api/messages", messageRouter);

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
