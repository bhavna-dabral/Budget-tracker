import mongoose from "mongoose";

const IncomeSchema = new mongoose.Schema(
  {
     userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User", // References the User collection
          required: true,
        },
    title: {
      type: String,
      required: true,
      trim: true,
      maxLength: 50,
    },
    amount: {
      type: Number,
      required: true,
      max: 1000000000, // limit to reasonable values (optional)
    },
    type: {
      type: String,
      default: "income",
    },
    date: {
      type: Date,
      required: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      maxLength: 200,
      trim: true,
    },
    // 👇 Add this field to link income to a specific user
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Income", IncomeSchema);
