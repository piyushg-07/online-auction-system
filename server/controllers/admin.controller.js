import Admin from "../models/admin.js";
import User from "../models/user.js";
import Product from "../models/product.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Admin signup
const handleAdminSignup = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(409).json({ error: "Admin already exists" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newAdmin = new Admin({ name, email, password: hashedPassword });
        await newAdmin.save();
        const token = jwt.sign({ adminId: newAdmin._id, email: newAdmin.email }, process.env.JWT_SECRET, { expiresIn: '14d' });
        return res.status(201).json({ token });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

// Admin login
const handleAdminLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(400).json({ error: "Admin doesn't exist." });
        }
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials" });
        }
        const token = jwt.sign({ adminId: admin._id, email: admin.email }, process.env.JWT_SECRET, { expiresIn: '14d' });
        return res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

// Get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, { password: 0 }); // Exclude passwords
        return res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

// Get all products
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().populate('seller', 'name email').populate('bids.bidder', 'name email');
        return res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

// Delete a user and their associated products
const deleteUserAndProducts = async (req, res) => {
    const { userId } = req.body;

    try {
        // Find the user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Delete all products associated with the user
        await Product.deleteMany({ seller: userId });

        // Delete the user
        await User.findByIdAndDelete(userId);

        return res.status(200).json({ message: "User and their products have been deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Delete a product by its ID
const deleteProduct = async (req, res) => {
    const { productId } = req.body;

    try {
        // Find the product
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        // Delete the product
        await Product.findByIdAndDelete(productId);

        return res.status(200).json({ message: "Product has been deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Admin creates a product
const createProduct = async (req, res) => {
    const { itemName, itemDescription, itemPrice, itemCategory, itemPhoto, itemStartDate, itemEndDate, sellerId } = req.body;

    try {
        // Validate seller existence
        const seller = await User.findById(sellerId);
        if (!seller) {
            return res.status(404).json({ error: "Seller not found" });
        }

        // Create a new product
        const newProduct = new Product({
            itemName,
            itemDescription,
            itemPrice,
            itemCategory,
            itemPhoto,
            itemStartDate,
            itemEndDate,
            seller: sellerId,
        });

        // Save the product to the database
        await newProduct.save();

        return res.status(201).json({ message: "Product created successfully", product: newProduct });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export {handleAdminSignup, handleAdminLogin, getAllUsers, getAllProducts, deleteUserAndProducts, deleteProduct,createProduct };