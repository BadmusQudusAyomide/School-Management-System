import mongoose from "mongoose";

const schoolSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },
    address: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      maxlength: 20,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    website: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    timezone: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    currency: {
      type: String,
      required: true,
      trim: true,
      maxlength: 10,
    },
    academicYear: {
      type: String,
      required: true,
      trim: true,
      maxlength: 20,
    },
  },
  {
    timestamps: true,
  }
);

schoolSchema.index({ name: 1 });
schoolSchema.index({ email: 1 });

const School = mongoose.model("School", schoolSchema);

export default School;
