import express from "express";
import * as wishlistController from "../controllers/wishlistController.js";

const router = express.Router();

router.post("/create_wishlist", wishlistController.createWishlist);

export default router;
