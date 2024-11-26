const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();

const cors = require('cors');

app.use(cors({
    origin: '*',
}));
app.get('/',(req,res)=>{
    res.send("<h1>Hello backend!</h1>")
})
const PORT = 3001;
const server = app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
const io = new Server(server,{
    cors: {
        origin: '*'
    }
});
io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('sendMessage', (message) => {
        console.log('Received message:', message);
        socket.broadcast.emit('receiveMessage', message); 
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});