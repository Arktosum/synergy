import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    displayName: {
        type: String,
    },
    displayPicture: {
        type: String,
    },
}, { timestamps: true, collection: "User" });

export const UserModel = mongoose.model('User', userSchema);