import mongoose from 'mongoose';
import 'mongoose-type-url';

const userSchema = new mongoose.Schema({
    displayName: String,
    email: String,
    photoURL: mongoose.SchemaTypes.Url,
    uid: String
});

export const users = mongoose.model('Users', userSchema)