const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const PORT = 3000;
app.use(cors());
app.use(express.json());

// let mongodbURI = `mongodb+srv://siddhujaykay2:shiine1984@synergy.en8nmpm.mongodb.net/main?retryWrites=true&w=majority`;
let mongodbURI = `mongodb://localhost:27017/main`;

const userRoute = require("./routes/users");
const messageRoute = require("./routes/messages");
const groupRoute = require("./routes/groups");
app.use("/api/users", userRoute);
app.use("/api/groups", groupRoute);
app.use("/api/messages", messageRoute);

mongoose.connect(mongodbURI, {
  useNewUrlParser: true,
});

app.get("/", (req, res) => {
  res.send("<h1>Welcome to backend</h1>");
});

const server = app.listen(PORT, () => {
  console.log(`Started listening on | http://localhost:${PORT}`);
});

const io = require("socket.io")(server, {
  cors: {
    pingTimeOut: 60000,
    origin: "*",
  },
});

io.on("connection", (socket) => {
  socket.on("send-message", (message) => {
    console.log(message);
    socket.to(message.to).emit("receive-message", message);
  });
  socket.on("join-room", (room) => {
    console.log(`Joined Room | ${room}`);
    socket.join(room);
  });
});
