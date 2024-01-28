import mongoose from 'mongoose';

const toastSchema = new mongoose.Schema({
    id: Number,
    user: String,
    checkinId: Number,
    createdAt: Date
});

export const toasts = mongoose.model('Toast', toastSchema)