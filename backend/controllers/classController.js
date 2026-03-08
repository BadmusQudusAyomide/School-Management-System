import asyncHandler from "../utils/asyncHandler.js";
import {
  createClass,
  deleteClass,
  getClasses,
  updateClass,
} from "../services/classService.js";

export const listClasses = asyncHandler(async (req, res) => {
  const classes = await getClasses(req.user);
  res.status(200).json({ success: true, data: classes });
});

export const addClass = asyncHandler(async (req, res) => {
  const classItem = await createClass(req.body, req.user);
  res.status(201).json({ success: true, data: classItem });
});

export const editClass = asyncHandler(async (req, res) => {
  const classItem = await updateClass(req.params.id, req.body, req.user);
  res.status(200).json({ success: true, data: classItem });
});

export const removeClass = asyncHandler(async (req, res) => {
  const result = await deleteClass(req.params.id, req.user);
  res.status(200).json({ success: true, data: result });
});
