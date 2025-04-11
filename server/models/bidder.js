import mongoose from "mongoose";

const bidderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    field: {
        type: String,
        default:"bidder"
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: false,
    },
    address: {
        type: String,
        required: false,
    },
    location: {
        type: String,
        required: false,
    },
    city: {
        type: String,
        required: false,
    },
    state: {
        type: String,
        required: false,
    },
    photo: {
        type: String, // Path to the photo
        required: false,
    },
}, { timestamps: true });

const Bidder = mongoose.model("Bidder", bidderSchema);

export default Bidder;