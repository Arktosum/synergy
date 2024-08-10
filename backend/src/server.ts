import express from 'express';
import dotenv from 'dotenv';
import connectDB from './database';
import cors from 'cors'
import errorHandler from './middlewares/errorHandler';
import authRoutes from './routes/authRoutes';
import cookieParser from 'cookie-parser';

dotenv.config();
const app = express();
connectDB();

const PORT = process.env.PORT || 5000;

// PRE MIDDLE WARES
app.use(cookieParser());
app.use(express.json({ limit: '50mb' }));
app.use(cors());

// ROUTES
app.use('/api/auth', authRoutes);


// POST MIDDLE WARE
// Make sure to add this after every other middlewares!!! , error handler must be at the end of all the functions.
app.use(errorHandler);

app.get('/', (req, res) => {
    res.send('<h1> Hello from the backend! </h1>');
});

app.listen(PORT, () => {
    console.log(`Server is running on : http://localhost:${PORT}`);
});

export default app;