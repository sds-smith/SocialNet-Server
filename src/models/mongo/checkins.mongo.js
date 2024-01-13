import mongoose from 'mongoose';
import 'mongoose-type-url';

const checkinSchema = new mongoose.Schema({
    id: Number,
    user: String,
    coffee: {
        label: String,
        roaster: String,
        singleOrigin: Boolean,
        origin: String,
        roast: String,
        process: String,
        imageUrl: mongoose.SchemaTypes.Url,
        tastingNotes: String,
        description: String
    },
    userNotes: String,
    createdAt: Date
});

export const checkins = mongoose.model('Checkin', checkinSchema)