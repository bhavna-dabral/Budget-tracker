import userModel from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendEmail } from "../config/brevo.js";

const COOKIE_NAME = "token";
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

// ===================== COOKIE OPTIONS =====================
const getCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
  maxAge: COOKIE_MAX_AGE,
});

// ===================== CREATE TOKEN =====================
const createToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// ===================== REGISTER =====================
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.json({ success: false, message: "Missing details" });
  }

  try {
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Invalid email" });
    }

    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = createToken(user);
    res.cookie(COOKIE_NAME, token, getCookieOptions());

    // ✅ Send welcome email (Fixed HTML String)
    try {
      await sendEmail(
        email,
        "Welcome to Expense Tracker 🎉",
        `<div style="font-family: Arial, sans-serif;">
          <h2 style="color: #4CAF50;">Welcome, ${name}!</h2>
          <p>Your account has been created successfully.</p>
          <p><b>Email:</b> ${email}</p>
          <p>Start tracking your expenses now 🚀</p>
        </div>`
      );
    } catch (mailError) {
      console.error("⚠️ Failed to send welcome email:", mailError.message);
    }

    res.status(201).json({
      success: true,
      token,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("❌ Register error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===================== LOGIN =====================
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({ success: false, message: "Missing details" });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid password" });
    }

    const token = createToken(user);
    res.cookie(COOKIE_NAME, token, getCookieOptions());

    res.json({ success: true, token, message: "Login successful" });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===================== PROFILE =====================
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user?.id || req.body.userId;
    const user = await userModel.findById(userId).select("-password");

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error("❌ Profile error:", error);
    res.json({ success: false, message: error.message });
  }
};

// ===================== LOGOUT =====================
export const logoutUser = async (req, res) => {
  try {
    res.clearCookie(COOKIE_NAME, getCookieOptions());
    res.json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.error("❌ Logout error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===================== SEND RESET OTP =====================
export const sendResetOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.json({ success: false, message: "Email required" });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 10 * 60 * 1000;
    await user.save();

    console.log("📨 Sending OTP to:", user.email);

    try {
      // ✅ Fixed HTML String for OTP email
      await sendEmail(
  user.email,
  "🔐 Your Budget Tracker OTP",
  `
  <div style="font-family:Arial;padding:20px">
    <h2>Reset Your Password</h2>
    <p>Your OTP is:</p>
    <h1 style="color:#6C63FF">${otp}</h1>
    <p>This OTP expires in 10 minutes.</p>
  </div>
  `
);

      console.log("✅ OTP email sent");
    } catch (mailError) {
      console.error("⚠️ Failed to send OTP email:", mailError.message);
      return res.json({ success: false, message: "Failed to send OTP email" });
    }

    res.json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("❌ Error sending OTP:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===================== RESET PASSWORD =====================
export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.json({ success: false, message: "Missing details" });
  }

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (user.resetOtp !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    if (user.resetOtpExpireAt < Date.now()) {
      return res.json({ success: false, message: "OTP expired" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetOtp = "";
    user.resetOtpExpireAt = 0;

    await user.save();

    res.json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    console.error("❌ Reset password error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===================== UPLOAD AVATAR =====================
export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const userId = req.user.id;

    const avatarPath = `/uploads/avatars/${req.file.filename}`;
    const fullAvatarUrl = `${req.protocol}://${req.get("host")}${avatarPath}`;

    const updatedUser = await userModel
      .findByIdAndUpdate(userId, { avatar: avatarPath }, { new: true })
      .select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "Avatar uploaded successfully",
      avatar: fullAvatarUrl,
      user: updatedUser,
    });
  } catch (error) {
    console.error("❌ Avatar upload error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to upload avatar",
    });
  }
};