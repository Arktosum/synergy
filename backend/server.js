const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const socketio = require("socket.io");
app.use(express.json());
app.use(cors());
const userRouter = require("./routes/userRoutes");
const authRouter = require("./routes/authRoutes");
const roomRouter = require("./routes/roomRoutes");

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
app.use("/api/room", roomRouter);

app.get("/", (req, res) => {
  res.send("<h1>Welcome to the backend!</h1>");
});

const PORT = process.env.PORT || 3000;
const expressServer = app.listen(PORT, () => {
  console.log(`Server online! : http://localhost:${PORT}`);
});

const io = new socketio.Server(expressServer,{
  cors : {
    origin : "*"
  }
})

io.on('connection',(socket)=>{
  console.log(`${socket.id} has connected!`);

  socket.on('send-message',(message)=>{
    io.emit('receive-message', message)
  })
  socket.on('disconnect',()=>{
    console.log(`${socket.id} has disconnected!`);
  })
})


/*
  To all clients: io.emit()
  To all clients except sender : socket.broadcast.emit()
  To all clients connected to room : io.to(room-name).emit()
  Join a room : socket.join(room-name)
  Leave a room : socket.leave(room-name)
*/