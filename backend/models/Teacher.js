import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    employeeId: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    subjects: {
      type: [String],
      default: [],
    },
    classes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class",
      },
    ],
    qualification: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    salary: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

teacherSchema.index({ employeeId: 1 });

const Teacher = mongoose.model("Teacher", teacherSchema);

export default Teacher;
