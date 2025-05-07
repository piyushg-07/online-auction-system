import express from "express";
import { handleAdminSignup, handleAdminLogin, getAllUsers, getAllProducts, deleteUserAndProducts, deleteProduct, createProduct,getAllBiddersWithProposals } from "../controllers/admin.controller.js";

const router = express.Router();

// Admin signup
router.post("/signup", handleAdminSignup);

// Admin login
router.post("/login", handleAdminLogin);

// Get all users
router.get("/users", getAllUsers);
// Get all users
router.get("/getAllBiddersWithProposals", getAllBiddersWithProposals);

// Get all products
router.get("/products", getAllProducts);

// Delete a user and their products
router.delete("/user", deleteUserAndProducts);

// Delete a product
router.delete("/product", deleteProduct);

// Create a product
router.post("/product", createProduct);

export default router;