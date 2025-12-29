import { Router } from "express";
import {
  changePassword,
  deleteAccount,
  forgotPassword,
  getProfile,
  loginUser,
  logoutUser,
  resetPassword,
  sendEmailVerificationLink,
  signupUser,
  verifyEmail,
} from "../controllers/user.controller.js";
import authenticate from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/logout", authenticate, logoutUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/change-password", authenticate, changePassword);
router.post(
  "/send-verification-email-link",
  authenticate,
  sendEmailVerificationLink
);

router.get("/verify-email/:token", verifyEmail);
router.get("/profile", authenticate, getProfile);
router.delete("/delete-account", authenticate, deleteAccount);

export default router;
