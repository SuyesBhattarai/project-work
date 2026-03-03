import express from "express";
import { authController } from "../../controller/auth/authController.js";

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/forgot-password", authController.forgotPassword);

export { router as authRouter };