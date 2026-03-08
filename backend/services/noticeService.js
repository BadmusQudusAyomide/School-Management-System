import Notice from "../models/Notice.js";
import { notFound } from "../utils/errors.js";
import { createNotificationsForRole } from "./notificationService.js";

export const createNotice = async (payload, currentUser) => {
  const notice = await Notice.create({
    ...payload,
    createdBy: currentUser._id,
  });

  await createNotificationsForRole({
    schoolId: currentUser.schoolId,
    targetRole: payload.targetRole,
    title: notice.title,
    message: notice.description,
    relatedNotice: notice._id,
  });

  return notice;
};

export const getNotices = async (currentUser) =>
  Notice.find({
    $or: [{ targetRole: currentUser.role }, { createdBy: currentUser._id }],
  })
    .populate("createdBy", "-password")
    .sort({ createdAt: -1 });

export const updateNotice = async (id, payload) => {
  const notice = await Notice.findById(id);
  if (!notice) {
    throw notFound("Notice not found");
  }

  ["title", "description", "targetRole"].forEach((field) => {
    if (payload[field] !== undefined) {
      notice[field] = payload[field];
    }
  });

  await notice.save();
  return notice;
};

export const deleteNotice = async (id) => {
  const notice = await Notice.findByIdAndDelete(id);
  if (!notice) {
    throw notFound("Notice not found");
  }

  return { id };
};
