import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },
    type: {
      type: String,
      enum: ["attendance", "finance", "academic", "custom"],
      required: true,
      index: true,
    },
    period: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    summary: {
      type: String,
      trim: true,
      maxlength: 3000,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

const Report = mongoose.model("Report", reportSchema);

export default Report;
