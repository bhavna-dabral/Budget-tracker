// models/userModel.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },

    // 🧩 Avatar field (for permanent profile picture)
    avatar: { type: String, default: "" },

    // Optional data
    cartData: { type: Object, default: {} },

    // Password reset fields
    resetOtp: { type: String, default: "" },
    resetOtpExpireAt: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// ✅ Prevent model overwrite in dev
const userModel = mongoose.models.User || mongoose.model("User", userSchema);

export default userModel;
