const express = require('express');
const mongoose = require('mongoose');
const usersRouter = require('./routes/users');
const roomsRouter = require('./routes/rooms');
const cors = require('cors');

const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect('mongodb+srv://siddhujaykay2:shiine1984@synergy.en8nmpm.mongodb.net/main', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Middleware
app.use(express.json());
app.use(cors({
  origin : "*"
})); // Enable CORS

// Routes
app.use('/users', usersRouter);
app.use('/rooms', roomsRouter);

// Start the server
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Initialize Socket.io
const io = require('socket.io')(server);

// Socket.io connection event
io.on('connection', (socket) => {
  // When a user joins a room
  console.log(socket.id + "Has connected!")
  socket.on('join-room', (roomId) => {
    // Join the specified room
    socket.join(roomId);
  });

  // When a user sends a message
  socket.on('send-message', (roomId, message) => {
    // Broadcast the message to all users in the room, except the sender
    socket.to(roomId).emit('receive-message', message);
  });
});



