import mongoose from "mongoose";

const examSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
      index: true,
    },
    subjects: {
      type: [String],
      default: [],
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

examSchema.index({ name: 1, class: 1, date: 1 }, { unique: true });

const Exam = mongoose.model("Exam", examSchema);

export default Exam;
