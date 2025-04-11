import Bidder from "../models/bidder.js";
import Product from "../models/product.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Bidder signup
const handleBidderSignup = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existingBidder = await Bidder.findOne({ email });
        if (existingBidder) {
            return res.status(409).json({ error: "Bidder already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newBidder = new Bidder({ name, email, password: hashedPassword });
        await newBidder.save();

        const token = jwt.sign(
            { bidderId: newBidder._id, email: newBidder.email },
            process.env.JWT_SECRET,
            { expiresIn: "14d" }
        );

        return res.status(201).json({ token });
    } catch (error) {
        console.error("Signup error:", error.message); // Log the error
        res.status(500).json({ error: "Internal server error" });
    }
};


// Bidder login
const handleBidderLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const bidder = await Bidder.findOne({ email });
        if (!bidder) {
            return res.status(400).json({ error: "Bidder doesn't exist." });
        }
        const isMatch = await bcrypt.compare(password, bidder.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials" });
        }
        const token = jwt.sign({ bidderId: bidder._id, email: bidder.email }, process.env.JWT_SECRET, { expiresIn: "14d" });
        return res.status(200).json({ token, bidder });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

// Place a bid on a product
const placeBid = async (req, res) => {
    const { productId, bidAmount } = req.body;
    const bidderId = req.bidderId; // Assuming bidderId is extracted from the token in middleware

    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        // Add the bid to the product
        product.bids.push({
            bidder: bidderId,
            bid: bidAmount,
            time: new Date(),
        });

        await product.save();

        return res.status(200).json({ message: "Bid placed successfully", product });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

// Get bidder profile
const getBidderProfile = async (req, res) => {
    const bidderId = req.bidderId; // Assuming bidderId is extracted from the token in middleware

    try {
        const bidder = await Bidder.findById(bidderId, { password: 0 }); // Exclude password
        if (!bidder) {
            return res.status(404).json({ error: "Bidder not found" });
        }
        return res.status(200).json({ bidder });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Update bidder profile
const updateBidderProfile = async (req, res) => {
    const bidderId = req.bidderId; // Assuming bidderId is extracted from the token in middleware
    const { name, phone, address, location, city, state, photo } = req.body;

    try {
        const updatedBidder = await Bidder.findByIdAndUpdate(
            bidderId,
            { name, phone, address, location, city, state, photo },
            { new: true, runValidators: true } // Return the updated document and validate fields
        );

        if (!updatedBidder) {
            return res.status(404).json({ error: "Bidder not found" });
        }

        return res.status(200).json({ message: "Profile updated successfully", bidder: updatedBidder });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Get all bids placed by the bidder
const getBidderBids = async (req, res) => {
    const bidderId = req.bidderId; // Assuming bidderId is extracted from the token in middleware

    try {
        // Find all products where the bidder has placed bids
        const products = await Product.find({ "bids.bidder": bidderId }, { itemName: 1, bids: 1 })
            .populate("bids.bidder", "name email");

        // Filter only the bids placed by this bidder
        const bidderBids = products.map(product => ({
            productId: product._id,
            itemName: product.itemName,
            bids: product.bids.filter(bid => bid.bidder._id.toString() === bidderId),
        }));

        return res.status(200).json({ bids: bidderBids });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export { handleBidderSignup, handleBidderLogin, placeBid, getBidderProfile, updateBidderProfile, getBidderBids };