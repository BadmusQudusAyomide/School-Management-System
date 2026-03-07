import mongoose from "mongoose";

const parentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    children: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
      },
    ],
    occupation: {
      type: String,
      trim: true,
      maxlength: 120,
    },
    phone: {
      type: String,
      trim: true,
      maxlength: 20,
    },
  },
  {
    timestamps: true,
  }
);

parentSchema.index({ userId: 1 });

const Parent = mongoose.model("Parent", parentSchema);

export default Parent;
