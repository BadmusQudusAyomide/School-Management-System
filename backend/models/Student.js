import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    admissionNumber: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
      index: true,
    },
    section: {
      type: String,
      required: true,
      trim: true,
      maxlength: 20,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Parent",
      required: true,
      index: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    feesStatus: {
      type: String,
      enum: ["paid", "pending", "partial", "overdue"],
      default: "pending",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

studentSchema.index({ admissionNumber: 1 });
studentSchema.index({ class: 1, section: 1 });

const Student = mongoose.model("Student", studentSchema);

export default Student;
