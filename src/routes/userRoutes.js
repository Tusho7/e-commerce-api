import express from 'express';
import registerUser from "../controllers/userController.js";

const router = express.Router();

router.post("/register_user", registerUser)

export default router;