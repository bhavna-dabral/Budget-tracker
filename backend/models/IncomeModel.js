import mongoose from "mongoose";

const IncomeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },

    amount: {
      type: Number,
      required: true,
      max: 1000000000,
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
      trim: true,
      maxlength: 200,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Income", IncomeSchema);