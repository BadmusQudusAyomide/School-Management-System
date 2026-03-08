import Setting from "../models/Setting.js";
import { notFound } from "../utils/errors.js";

export const getSettings = async () => Setting.find().populate("updatedBy", "-password").sort({ key: 1 });

export const createSetting = async (payload, currentUser) =>
  Setting.create({
    ...payload,
    updatedBy: currentUser._id,
  });

export const updateSetting = async (id, payload, currentUser) => {
  const setting = await Setting.findById(id);
  if (!setting) {
    throw notFound("Setting not found");
  }

  ["key", "value", "description"].forEach((field) => {
    if (payload[field] !== undefined) {
      setting[field] = payload[field];
    }
  });

  setting.updatedBy = currentUser._id;
  await setting.save();
  return setting;
};

export const deleteSetting = async (id) => {
  const setting = await Setting.findByIdAndDelete(id);
  if (!setting) {
    throw notFound("Setting not found");
  }

  return { id };
};
