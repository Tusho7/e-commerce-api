import express from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  updateUser,
} from "../controllers/userController.js";
import multer from "multer";
import { fileStorage, fileFilter } from "../utils/multer.js";

const router = express.Router();

router.post(
  "/register_user",
  multer({ storage: fileStorage, fileFilter }).single("profilePicture"),
  registerUser
);

router.post("/login", loginUser);

router.post("/logout", logoutUser);

router.put("/update_user", updateUser);

export default router;
