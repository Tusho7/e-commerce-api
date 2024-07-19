import express from "express";
import {
  contactAdmin,
  createContact,
  deleteMessageById,
  editContactById,
  getContacts,
  getMessages,
} from "../controllers/contactRoutes.js";

const router = express.Router();

router.post("/contact", contactAdmin);

router.get("/messages", getMessages);

router.delete("/delete_message/:id", deleteMessageById);

router.post("/create_contact_us", createContact);

router.post("/edit_contact_us/:id", editContactById);

router.get("/get_contact_us", getContacts);

export default router;
