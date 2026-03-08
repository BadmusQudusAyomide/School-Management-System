import asyncHandler from "../utils/asyncHandler.js";
import {
  createTimetable,
  deleteTimetable,
  getTimetables,
  updateTimetable,
} from "../services/timetableService.js";

export const listTimetables = asyncHandler(async (_req, res) => {
  const timetables = await getTimetables();
  res.status(200).json({ success: true, data: timetables });
});

export const addTimetable = asyncHandler(async (req, res) => {
  const timetable = await createTimetable(req.body);
  res.status(201).json({ success: true, data: timetable });
});

export const editTimetable = asyncHandler(async (req, res) => {
  const timetable = await updateTimetable(req.params.id, req.body);
  res.status(200).json({ success: true, data: timetable });
});

export const removeTimetable = asyncHandler(async (req, res) => {
  const result = await deleteTimetable(req.params.id);
  res.status(200).json({ success: true, data: result });
});
