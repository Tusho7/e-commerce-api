import express from "express";
import {
  contactAdmin,
  deleteMessageById,
  getMessages,
} from "../controllers/contactRoutes.js";

const router = express.Router();

router.post("/contact", contactAdmin);

router.get("/messages", getMessages);

router.delete("/delete_message/:id", deleteMessageById);

export default router;
