import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Product from "../models/product.js";
import Bidder from "../models/bidder.js";
import Proposal from "../models/proposal.js"; // Import the Proposal model


dotenv.config().parsed;

const handleSignup = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user) {
            return res.status(409).json({ error: "User already exists" });
        }
        const newUser = new User({ name, email, password });
        const salt = await bcrypt.genSalt(10);
        newUser.password = await bcrypt.hash(password, salt);
        await newUser.save();
        const token = jwt.sign({ userId: newUser._id, name: name, email: email }, process.env.JWT_SECRET, { expiresIn: '14d' });
        return res.status(200).json({ token });
    }
    catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
}

const handleLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "User doesn't exist." });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials" });
        }
        const token = jwt.sign({ userId: user._id, name: user.name, email: user.email }, process.env.JWT_SECRET, { expiresIn: '14d' });
        return res.status(201).json({ token, user });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
}

const handleDelete = async (req, res) => {
    const { userId } = req.body;

    try {
        // Find the user first
        const user = await User.findOne({ _id: userId });
        if (!user) {
            return res.status(400).json({ error: "User doesn't exist." });
        }

        // Delete all posts of the user
        await Product.deleteMany({ seller: userId });

        // Delete the user
        await User.findOneAndDelete({ _id: userId });

        return res.status(200).json({ message: "User and all related posts deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
};

const handleGetUser = async (req, res) => {
    const { seller } = req.body;
    console.log(seller);
    const user = await User.findOne({ _id: seller }, { name: 1, _id: 0 });
    return res.status(200).json(user);
}

const handleUser = async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await User.findOne({ _id: userId }, { password: 0 });
        if (!user) {
            console.log("hii");
            return res.status(400).json({ error: "User doesn't exist." });
        }
        const products = await Product.find({ seller: userId }).sort({ createdAt: -1 }).populate('seller', '_id name');
        if (products.length === 0) {
            return res.status(200).json({ message: "No products found.", user });
        }
        return res.status(200).json({ message: "User and Products", user, products });
    }
    catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
}


const UsersWithProposals = async (req, res) => {
    try {
        console.log("Fetching all users..."); // Debugging log
        const users = await Bidder.find({}, { password: 0 }); // Exclude password for security
        if (!users || users.length === 0) {
            console.log("No users found."); // Debugging log
            return res.status(404).json({ error: "No users found." });
        }
        console.log("Users fetched:", users);

        console.log("Fetching all proposals..."); // Debugging log
        const proposals = await Proposal.find({});
        if (!proposals || proposals.length === 0) {
            console.log("No proposals found."); // Debugging log
        } else {
            console.log("Proposals fetched:", proposals);
        }

        // Map proposals to their respective users
        const usersWithProposals = users.map((user) => {
            const userProposals = proposals.filter(
                (proposal) => proposal.user_id.toString() === user._id.toString()
            );
            return {
                ...user.toObject(),
                proposals: userProposals,
            };
        });

        console.log("Users with proposals mapped successfully."); // Debugging log
        return res.status(200).json({ users: usersWithProposals });
    } catch (error) {
        console.log("Error fetching users and proposals:", error); // Debugging log
        return res.status(500).json({ error: "Internal server error" });
    }
};


export { handleSignup, handleLogin, handleDelete, handleGetUser, handleUser, UsersWithProposals };