import asyncHandler from "../utils/asyncHandler.js";
import { getNotificationsForUser, markNotificationAsRead } from "../services/notificationService.js";

export const listNotifications = asyncHandler(async (req, res) => {
  const notifications = await getNotificationsForUser(req.user._id);
  res.status(200).json({
    success: true,
    data: notifications,
  });
});

export const readNotification = asyncHandler(async (req, res) => {
  const notification = await markNotificationAsRead(req.params.id, req.user._id);
  res.status(200).json({
    success: true,
    data: notification,
  });
});
