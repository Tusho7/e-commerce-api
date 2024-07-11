import express from "express";

import * as cartController from "../controllers/cartController.js";

const router = express.Router();

router.post("/add_to_cart", cartController.createCart);

export default router;
