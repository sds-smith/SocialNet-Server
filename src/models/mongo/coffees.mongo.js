import mongoose from 'mongoose';
import { ObjectId } from 'mongodb';

const coffeeSchema = new mongoose.Schema({
    id: Number,
    label: String,
    roaster: String,
    singleOrigin: Boolean,
    origin: String,
    roast: String,
    process: String,
    tastingNotes: String,
    description: String
});

export const coffees = mongoose.model('Coffee', coffeeSchema)