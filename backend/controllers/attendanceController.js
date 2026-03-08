import asyncHandler from "../utils/asyncHandler.js";
import {
  createAttendance,
  deleteAttendance,
  getAttendance,
  getAttendanceByClass,
  updateAttendance,
} from "../services/attendanceService.js";

export const markAttendance = asyncHandler(async (req, res) => {
  const attendance = await createAttendance(req.body, req.user);
  res.status(201).json({ success: true, data: attendance });
});

export const listAttendanceByClass = asyncHandler(async (req, res) => {
  const attendance = await getAttendanceByClass(req.params.id);
  res.status(200).json({ success: true, data: attendance });
});

export const listAttendance = asyncHandler(async (_req, res) => {
  const attendance = await getAttendance();
  res.status(200).json({ success: true, data: attendance });
});

export const editAttendance = asyncHandler(async (req, res) => {
  const attendance = await updateAttendance(req.params.id, req.body, req.user);
  res.status(200).json({ success: true, data: attendance });
});

export const removeAttendance = asyncHandler(async (req, res) => {
  const result = await deleteAttendance(req.params.id, req.user);
  res.status(200).json({ success: true, data: result });
});
