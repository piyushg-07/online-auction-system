import express from "express";
import {
  handleBidderSignup,
  handleBidderLogin,
  placeBid,
  getBidderProfile,
  updateBidderProfile,
  getBidderBids,
} from "../controllers/bidder.controller.js";
import bidderAuth from "../middleware/bidderAuth.js";

const router = express.Router();

// Bidder signup
router.post("/signup", handleBidderSignup);

// Bidder login
router.post("/login", handleBidderLogin);

// Place a bid
router.post("/bid", placeBid);

router.get("/profile", bidderAuth, getBidderProfile);
router.put("/updateprofile", bidderAuth, updateBidderProfile);

// Get all bids placed by the bidder
router.get("/getbids", getBidderBids);

export default router;
