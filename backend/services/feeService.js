import Fee from "../models/Fee.js";
import { notFound } from "../utils/errors.js";

export const createFee = async (payload) => Fee.create(payload);

export const getFeesByStudent = async (studentId) =>
  Fee.find({ student: studentId })
    .populate({
      path: "student",
      populate: { path: "userId", select: "-password" },
    })
    .sort({ dueDate: -1 });

export const getFees = async () =>
  Fee.find()
    .populate({
      path: "student",
      populate: { path: "userId", select: "-password" },
    })
    .sort({ dueDate: -1 });

export const updateFee = async (id, payload) => {
  const fee = await Fee.findById(id);
  if (!fee) {
    throw notFound("Fee record not found");
  }

  ["student", "amount", "paid", "status", "dueDate"].forEach((field) => {
    if (payload[field] !== undefined) {
      fee[field] = payload[field];
    }
  });

  await fee.save();
  return fee;
};

export const deleteFee = async (id) => {
  const fee = await Fee.findByIdAndDelete(id);
  if (!fee) {
    throw notFound("Fee record not found");
  }

  return { id };
};
