import Notification from "../models/Notification.js";
import User from "../models/User.js";
import { sendEmail } from "./emailService.js";
import { notFound } from "../utils/errors.js";

export const createNotificationsForRole = async ({
  schoolId,
  targetRole,
  title,
  message,
  relatedNotice = null,
}) => {
  const recipients = await User.find({
    schoolId,
    role: targetRole,
    isActive: true,
  }).select("_id email name");

  if (!recipients.length) {
    return [];
  }

  const notifications = await Notification.insertMany(
    recipients.map((recipient) => ({
      title,
      message,
      type: "notice",
      recipient: recipient._id,
      relatedNotice,
    }))
  );

  await Promise.allSettled(
    recipients.map((recipient) =>
      sendEmail({
        to: recipient.email,
        subject: title,
        text: `${message}\n\nSchool Management System`,
        html: `<p>Hello ${recipient.name},</p><p>${message}</p><p>School Management System</p>`,
      })
    )
  );

  return notifications;
};

export const getNotificationsForUser = async (userId) =>
  Notification.find({ recipient: userId })
    .sort({ createdAt: -1 })
    .populate("relatedNotice");

export const markNotificationAsRead = async (notificationId, userId) => {
  const notification = await Notification.findOne({
    _id: notificationId,
    recipient: userId,
  });

  if (!notification) {
    throw notFound("Notification not found");
  }

  notification.isRead = true;
  await notification.save();
  return notification;
};
