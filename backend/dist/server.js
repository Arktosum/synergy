"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// MongoDB connection
mongoose_1.default.connect(process.env.MONGO_URI).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});
// Message schema and model
const messageSchema = new mongoose_1.default.Schema({
    user: String,
    text: String,
}, { timestamps: true });
const Message = mongoose_1.default.model('Message', messageSchema);
// Socket.IO connection
io.on('connection', (socket) => {
    console.log('A User connected with id : ', socket.id);
    // // Load existing messages from the database
    // Message.find().then(messages => {
    //     socket.emit('load-messages', messages);
    // });
    // Listen for new messages
    socket.on('send-message', (msg) => {
        console.log(msg);
        const message = new Message(msg);
        message.save().then(() => {
            io.emit('recieve-message', msg);
        }).catch(err => {
            console.error('Error saving message:', err);
        });
    });
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Server listening on : http://localhost:${PORT}`);
});
