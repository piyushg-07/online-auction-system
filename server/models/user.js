import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxLength: 32
    },
    field: {
        type: String,
        default:"admin"
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;