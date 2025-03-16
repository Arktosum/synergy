import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from "dotenv";

dotenv.config();
const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI as string).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

// Message schema and model
const messageSchema = new mongoose.Schema({
    user: String,
    text: String,
}, { timestamps: true });

const Message = mongoose.model('Message', messageSchema);

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
