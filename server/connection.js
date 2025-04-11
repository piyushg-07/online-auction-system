import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config().parsed;

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            dbName: process.env.DB_NAME // Add the database name from environment variables
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.log('Error connecting to MongoDB')
    }
}

export default connectDB;