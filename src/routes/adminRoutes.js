import express from "express";
import {
  createAdmin,
  getAdmin,
  getAllUsers,
  loginAdmin,
  logoutAdmin,
  updateAdmin,
  updateUserById,
} from "../controllers/adminController.js";
import { adminMiddleware } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register_admin", createAdmin);
router.post("/login_admin", loginAdmin);
router.post("/logout_admin", logoutAdmin);

router.get("/get_admin", adminMiddleware, getAdmin);
router.put("/update_admin", updateAdmin);
router.get("/get_all_users", getAllUsers);

router.put("/update_user/:id", updateUserById);

export default router;
