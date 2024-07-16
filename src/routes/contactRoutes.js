import express from "express";
import { contactAdmin } from "../controllers/contactRoutes.js";

const router = express.Router();

router.post("/contact", contactAdmin);

export default router;
