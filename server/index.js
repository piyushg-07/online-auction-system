import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config().parsed;
import connectDB from './connection.js'
import userRouter from './routes/user.js';
import adminRoutes from "./routes/admin.js";
import auctionRouter from './routes/auction.js';
import bidderRoutes from "./routes/bidder.js";
import auth from './middleware/auth.js';

const port = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use(cors({ origin: '*', optionsSuccessStatus: 200 }));

connectDB();

app.get('/', async (req, res) => {
    res.json({ msg: 'Welcome to Online Auction System API' });
});
app.use('/api', userRouter);
app.use('/api/auction', auth, auctionRouter);
// Admin routes
app.use("/api/admin", adminRoutes);
// Bidder routes
app.use("/api/bidder", bidderRoutes);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});