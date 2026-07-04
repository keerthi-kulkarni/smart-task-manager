import express from "express";
import {
  forgotPassword,
  resetPassword,
  getMe,
  login,
  logout,
  register,
  updateProfile
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import {
  forgotPasswordValidator,
  loginValidator,
  registerValidator,
  resetPasswordValidator,
  updateProfileValidator
} from "../middleware/validators.js";
const router = express.Router();

router.post("/register", registerValidator, register);
router.post("/login", loginValidator, login);

router.post(
  "/forgot-password",
  forgotPasswordValidator,
  forgotPassword
);
router.post(
  "/reset-password/:token",
  resetPasswordValidator,
  resetPassword
);

router.post("/logout", logout);

router.get("/me", protect, getMe);

router.patch("/profile", protect, updateProfileValidator, updateProfile);
export default router;
