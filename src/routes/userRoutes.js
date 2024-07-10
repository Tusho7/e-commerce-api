import express from "express";
import registerUser from "../controllers/userController.js";
import multer from "multer";
import { fileStorage, fileFilter } from "../utils/multer.js";

const router = express.Router();

router.post(
  "/register_user",
  multer({ storage: fileStorage, fileFilter }).single("profilePicture"),
  registerUser
);

export default router;
