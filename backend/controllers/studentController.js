import asyncHandler from "../utils/asyncHandler.js";
import {
  createStudent,
  deleteStudent,
  getStudentById,
  getStudents,
  updateStudent,
} from "../services/studentService.js";

export const listStudents = asyncHandler(async (req, res) => {
  const students = await getStudents(req.user);
  res.status(200).json({ success: true, data: students });
});

export const getStudent = asyncHandler(async (req, res) => {
  const student = await getStudentById(req.params.id, req.user);
  res.status(200).json({ success: true, data: student });
});

export const addStudent = asyncHandler(async (req, res) => {
  const student = await createStudent(req.body, req.user);
  res.status(201).json({ success: true, data: student });
});

export const editStudent = asyncHandler(async (req, res) => {
  const student = await updateStudent(req.params.id, req.body, req.user);
  res.status(200).json({ success: true, data: student });
});

export const removeStudent = asyncHandler(async (req, res) => {
  const result = await deleteStudent(req.params.id, req.user);
  res.status(200).json({ success: true, data: result });
});
