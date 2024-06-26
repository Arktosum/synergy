import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import userRouter from './routes/userRouter'
import dotenv from 'dotenv';

dotenv.config();

mongoose.connect(process.env.MONGODBURI ?? '').then((mongoose) => {
    console.log('Connected to MongoDB at :', mongoose.connection.host);
})

const app = express();
const PORT = process.env.PORT || 8080;


app.use(express.json());
app.use(cors());
app.use('/api/users', userRouter)

app.get('/', (req, res) => {
    res.send('welcome to the backend!');
})

app.get('/test', (req, res) => {
    res.send({ success: true });
})

app.listen(PORT, () => {
    console.log(`Server listening on : http://localhost:${PORT}`);
})