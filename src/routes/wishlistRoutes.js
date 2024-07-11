import express from "express";
import * as wishlistController from "../controllers/wishlistController.js";

const router = express.Router();

router.post("/create_wishlist", wishlistController.createWishlist);
router.get("/get_wishlist/:userId", wishlistController.getWishlist);

export default router;
