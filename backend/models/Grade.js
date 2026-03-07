import mongoose from "mongoose";

const gradeSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      index: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
      index: true,
    },
    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
      index: true,
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    grade: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5,
    },
  },
  {
    timestamps: true,
  }
);

gradeSchema.index({ student: 1, subject: 1, exam: 1 }, { unique: true });

const Grade = mongoose.model("Grade", gradeSchema);

export default Grade;
