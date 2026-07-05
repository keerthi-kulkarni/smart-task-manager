import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  deleteNotification,
  getNotifications,
  getUnreadCount,
  markAllAsRead,
  markAsRead
} from "../services/notificationService.js";

export const listNotifications = asyncHandler(async (req, res) => {
  const { page, limit, filter = "all" } = req.query;
  const payload = await getNotifications({
    userId: req.user._id,
    page,
    limit,
    filter
  });

  res.status(200).json(payload);
});

export const readNotification = asyncHandler(async (req, res) => {
  const notification = await markAsRead(req.params.id, req.user._id);

  res.status(200).json({ notification });
});

export const readAllNotifications = asyncHandler(async (req, res) => {
  await markAllAsRead(req.user._id);

  res.status(200).json({ message: "All notifications marked as read." });
});

export const removeNotification = asyncHandler(async (req, res) => {
  await deleteNotification(req.params.id, req.user._id);

  res.status(200).json({ message: "Notification deleted successfully." });
});

export const unreadCount = asyncHandler(async (req, res) => {
  const count = await getUnreadCount(req.user._id);

  res.status(200).json({ count });
});
