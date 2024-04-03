// server.js

require("dotenv").config(); // Load environment variables from .env file

const express = require("express");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
const socketio = require("socket.io");
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes");
const authRoutes = require("./routes/authRoutes");

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.json());
app.use(cors());
// Connect to MongoDB database
mongoose.connect(process.env.MONGODB_URI);

// Use routes
// app.use("/api/users", userRoutes);
// app.use("/api/messages", messageRoutes);
app.use("/api/auth", authRoutes);

// Socket.IO implementation for real-time messaging
io.on("connection", (socket) => {
  console.log("New socket connection: ", socket.id);

  // Handle incoming messages
  socket.on("sendMessage", (message) => {
    // Save message to database
    // Emit message to appropriate recipient(s)
    io.emit("newMessage", message);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("Socket disconnected: ", socket.id);
  });
});

app.get("/", (req, res) => {
  res.send("<h1>Hello from the backend!</h1>");
});
// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
