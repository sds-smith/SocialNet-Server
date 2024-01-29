import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    id: Number,
    user: String,
    checkinId: Number,
    comment: String,
    createdAt: Date
});

export const comments = mongoose.model('Comment', commentSchema)