const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const usersRouter = require('./routes/users');
const roomsRouter = require('./routes/rooms');

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

const io = require('socket.io')(server,{
  cors:{
    pingTimeOut:60000,
    origin: '*'
  }
})

io.on("connection", (socket) => {
  socket.on("send-message", (message) => {
    //  {
    //     participants,
    //     roomId
    //     from,
    //     content
    // }
    socket.to(message.room).emit("receive-message", message);
    for(let participant of message.participants){
      if(participant == from) continue;
        socket.join(participant);
        socket.to(participant).emit("receive-notification",message);
        socket.leave(participant);
    }
  });
  socket.on("join-room", (room) => {
    console.log(`Joined Room | ${room}`);
    socket.join(room);
  });
});



