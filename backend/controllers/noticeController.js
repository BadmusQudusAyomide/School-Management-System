import asyncHandler from "../utils/asyncHandler.js";
import { createNotice, deleteNotice, getNotices, updateNotice } from "../services/noticeService.js";

export const addNotice = asyncHandler(async (req, res) => {
  const notice = await createNotice(req.body, req.user);
  res.status(201).json({ success: true, data: notice });
});

export const listNotices = asyncHandler(async (req, res) => {
  const notices = await getNotices(req.user);
  res.status(200).json({ success: true, data: notices });
});

export const editNotice = asyncHandler(async (req, res) => {
  const notice = await updateNotice(req.params.id, req.body);
  res.status(200).json({ success: true, data: notice });
});

export const removeNotice = asyncHandler(async (req, res) => {
  const result = await deleteNotice(req.params.id);
  res.status(200).json({ success: true, data: result });
});
