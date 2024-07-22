import express from "express";
import {
  createAdmin,
  getAdmin,
  loginAdmin,
  logoutAdmin,
  updateAdmin,
} from "../controllers/adminController.js";
import { adminMiddleware } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register_admin", createAdmin);
router.post("/login_admin", loginAdmin);
router.post("/logout_admin", logoutAdmin);

router.get("/get_admin", adminMiddleware, getAdmin);
router.put("/update_admin", updateAdmin);

export default router;
