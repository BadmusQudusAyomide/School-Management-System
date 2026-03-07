import mongoose from "mongoose";

const feeSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    paid: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ["pending", "partial", "paid", "overdue"],
      default: "pending",
      index: true,
    },
    dueDate: {
      type: Date,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

feeSchema.index({ student: 1, dueDate: 1 });

const Fee = mongoose.model("Fee", feeSchema);

export default Fee;
