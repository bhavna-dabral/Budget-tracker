import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import userModel from "../models/userModel.js";
import authUser from "../middleware/authUser.js"; // ✅ FIXED import

const router = express.Router();

// Setup __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for uploads
const storage = multer.diskStorage({
  destination: path.join(__dirname, "../uploads/avatars"),
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// ✅ Use authUser middleware instead of verifyUser
router.post("/upload-avatar", authUser, upload.single("avatar"), async (req, res) => {
  try {
    const userId = req.user.id; // ✅ `authUser` attaches user data to req.user
    const avatarPath = `/uploads/avatars/${req.file.filename}`;

    // Save avatar URL to DB
    await userModel.findByIdAndUpdate(userId, { avatar: avatarPath });

    res.json({
      success: true,
      message: "Avatar uploaded successfully",
      avatar: avatarPath,
    });
  } catch (error) {
    console.error("Avatar upload error:", error);
    res.status(500).json({ success: false, message: "Failed to upload avatar" });
  }
});

export default router;
