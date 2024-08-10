import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI as string;

function connectDB() {
    mongoose.connect(MONGODB_URI);

    const db = mongoose.connection;

    db.on('error', (err) => {
        console.error(`MongoDB connection error: ${err}`);
        process.exit(1); // Exit process with failure
    });

    db.once('open', () => {
        const dbName = mongoose.connection.db.databaseName;
        console.log(`MongoDB connected to Database : ${dbName}`);
    });

}

export default connectDB;

