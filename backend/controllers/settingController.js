import asyncHandler from "../utils/asyncHandler.js";
import { createSetting, deleteSetting, getSettings, updateSetting } from "../services/settingService.js";

export const listSettings = asyncHandler(async (_req, res) => {
  const settings = await getSettings();
  res.status(200).json({ success: true, data: settings });
});

export const addSetting = asyncHandler(async (req, res) => {
  const setting = await createSetting(req.body, req.user);
  res.status(201).json({ success: true, data: setting });
});

export const editSetting = asyncHandler(async (req, res) => {
  const setting = await updateSetting(req.params.id, req.body, req.user);
  res.status(200).json({ success: true, data: setting });
});

export const removeSetting = asyncHandler(async (req, res) => {
  const result = await deleteSetting(req.params.id);
  res.status(200).json({ success: true, data: result });
});
