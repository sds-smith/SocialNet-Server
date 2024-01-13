import mongoose from 'mongoose';
import 'mongoose-type-url';

const checkinSchema = new mongoose.Schema({
    id: Number,
    user: String,
    coffeeID: String,
    imageUrl: mongoose.SchemaTypes.Url,
    userNotes: String,
    createdAt: Date
});

export const checkins = mongoose.model('Checkin', checkinSchema)