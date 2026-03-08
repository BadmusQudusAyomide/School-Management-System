import asyncHandler from "../utils/asyncHandler.js";
import { createReport, deleteReport, getReports, updateReport } from "../services/reportService.js";

export const listReports = asyncHandler(async (_req, res) => {
  const reports = await getReports();
  res.status(200).json({ success: true, data: reports });
});

export const addReport = asyncHandler(async (req, res) => {
  const report = await createReport(req.body, req.user);
  res.status(201).json({ success: true, data: report });
});

export const editReport = asyncHandler(async (req, res) => {
  const report = await updateReport(req.params.id, req.body);
  res.status(200).json({ success: true, data: report });
});

export const removeReport = asyncHandler(async (req, res) => {
  const result = await deleteReport(req.params.id);
  res.status(200).json({ success: true, data: result });
});
