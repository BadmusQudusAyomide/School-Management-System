import asyncHandler from "../utils/asyncHandler.js";
import { createExam, deleteExam, getExams, updateExam } from "../services/examService.js";

export const addExam = asyncHandler(async (req, res) => {
  const exam = await createExam(req.body);
  res.status(201).json({ success: true, data: exam });
});

export const listExams = asyncHandler(async (_req, res) => {
  const exams = await getExams();
  res.status(200).json({ success: true, data: exams });
});

export const editExam = asyncHandler(async (req, res) => {
  const exam = await updateExam(req.params.id, req.body);
  res.status(200).json({ success: true, data: exam });
});

export const removeExam = asyncHandler(async (req, res) => {
  const result = await deleteExam(req.params.id);
  res.status(200).json({ success: true, data: result });
});
