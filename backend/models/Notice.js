import mongoose from "mongoose";

const noticeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    targetRole: {
      type: String,
      enum: ["admin", "teacher", "student", "parent", "accountant"],
      required: true,
      index: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

noticeSchema.index({ targetRole: 1, createdAt: -1 });

const Notice = mongoose.model("Notice", noticeSchema);

export default Notice;
