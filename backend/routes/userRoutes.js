import express from "express";
import {
  loginUser,
  registerUser,
  logoutUser,
  getUserProfile,
  sendResetOtp,
  resetPassword,
  uploadAvatar, // ✅ Add this if you support avatar upload
} from "../controllers/userController.js";
import authUser from "../middleware/authUser.js";

const userRouter = express.Router();

// 🧩 Auth routes
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/logout", logoutUser);

// 👤 Profile route (protected)
userRouter.get("/profile", authUser, getUserProfile); // ✅ GET is more standard for profile fetch

// 📸 Avatar upload (optional, protected)
userRouter.post("/upload-avatar", authUser, uploadAvatar); // ✅ Only if implemented

// 🔐 Password reset routes
userRouter.post("/send-reset-otp", sendResetOtp);
userRouter.post("/reset-password", resetPassword);

export default userRouter;
