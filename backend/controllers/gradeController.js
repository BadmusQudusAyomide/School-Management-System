import asyncHandler from "../utils/asyncHandler.js";
import { createGrade, deleteGrade, getGrades, getGradesByStudent, updateGrade } from "../services/gradeService.js";

export const addGrade = asyncHandler(async (req, res) => {
  const grade = await createGrade(req.body);
  res.status(201).json({ success: true, data: grade });
});

export const listGrades = asyncHandler(async (_req, res) => {
  const grades = await getGrades();
  res.status(200).json({ success: true, data: grades });
});

export const listGradesByStudent = asyncHandler(async (req, res) => {
  const grades = await getGradesByStudent(req.params.id);
  res.status(200).json({ success: true, data: grades });
});

export const editGrade = asyncHandler(async (req, res) => {
  const grade = await updateGrade(req.params.id, req.body);
  res.status(200).json({ success: true, data: grade });
});

export const removeGrade = asyncHandler(async (req, res) => {
  const result = await deleteGrade(req.params.id);
  res.status(200).json({ success: true, data: result });
});
