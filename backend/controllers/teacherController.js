import asyncHandler from "../utils/asyncHandler.js";
import {
  createTeacher,
  deleteTeacher,
  getTeachers,
  updateTeacher,
} from "../services/teacherService.js";

export const listTeachers = asyncHandler(async (req, res) => {
  const teachers = await getTeachers(req.user);
  res.status(200).json({ success: true, data: teachers });
});

export const addTeacher = asyncHandler(async (req, res) => {
  const teacher = await createTeacher(req.body, req.user);
  res.status(201).json({ success: true, data: teacher });
});

export const editTeacher = asyncHandler(async (req, res) => {
  const teacher = await updateTeacher(req.params.id, req.body, req.user);
  res.status(200).json({ success: true, data: teacher });
});

export const removeTeacher = asyncHandler(async (req, res) => {
  const result = await deleteTeacher(req.params.id, req.user);
  res.status(200).json({ success: true, data: result });
});
