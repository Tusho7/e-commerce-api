import express from "express";
import {
  * as userController
} from "../controllers/userController.js";
import multer from "multer";
import { fileStorage, fileFilter } from "../utils/multer.js";

const router = express.Router();

router.post(
  "/register_user",
  multer({ storage: fileStorage, fileFilter }).single("profilePicture"),
  registerUser
);

router.post("/login", userController.loginUser);

router.post("/logout", userController.logoutUser);

router.put("/update_user", userController.updateUser);

router.get("/verify", userController.verifyUser);

router.post("forgot_password", userController.forgotPassword);

router.get("/get_user", userController.getUser);

router.get("/total_users", userController.totalUsers);

router.patch("/toggle_block_user/:id", userController.toggleBlockUser);

router.delete("/delete_user/:id", userController.deleteUserById);

export default router;
