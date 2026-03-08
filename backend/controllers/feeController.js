import asyncHandler from "../utils/asyncHandler.js";
import { createFee, deleteFee, getFees, getFeesByStudent, updateFee } from "../services/feeService.js";

export const addFee = asyncHandler(async (req, res) => {
  const fee = await createFee(req.body);
  res.status(201).json({ success: true, data: fee });
});

export const listFees = asyncHandler(async (_req, res) => {
  const fees = await getFees();
  res.status(200).json({ success: true, data: fees });
});

export const listFeesByStudent = asyncHandler(async (req, res) => {
  const fees = await getFeesByStudent(req.params.id);
  res.status(200).json({ success: true, data: fees });
});

export const editFee = asyncHandler(async (req, res) => {
  const fee = await updateFee(req.params.id, req.body);
  res.status(200).json({ success: true, data: fee });
});

export const removeFee = asyncHandler(async (req, res) => {
  const result = await deleteFee(req.params.id);
  res.status(200).json({ success: true, data: result });
});
