import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    id: Number,
    user: String,
    text: String,
    createdAt: Date
});

export const messages = mongoose.model('Message', messageSchema)