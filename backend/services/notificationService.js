import Notification from "../models/Notification.js";
import Task from "../models/Task.js";
import sendEmail from "../utils/sendEmail.js";
import AppError from "../utils/AppError.js";

const REMINDER_TYPES = {
  "due-today": {
    title: "Task due today",
    type: "warning"
  },
  "due-tomorrow": {
    title: "Task due tomorrow",
    type: "info"
  },
  overdue: {
    title: "Task overdue",
    type: "error"
  },
  "high-priority-due-tomorrow": {
    title: "High priority task due tomorrow",
    type: "warning"
  }
};

const OVERDUE_REMINDER_INTERVAL_MS = 60 * 60 * 1000;

export const getReminderTypeForTask = (
  task,
  currentDate = new Date()
) => {
  if (!task || task.status === "Completed") {
    return null;
  }

  const dueDate = new Date(task.dueDate);

  // Already overdue (checks full date + time)
  if (currentDate > dueDate) {
    return "overdue";
  }

  // Date-only comparison for today/tomorrow reminders
  const today = new Date(currentDate);
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const dueDay = new Date(dueDate);
  dueDay.setHours(0, 0, 0, 0);

  if (dueDay.getTime() === today.getTime()) {
    return "due-today";
  }

  if (dueDay.getTime() === tomorrow.getTime()) {
    return task.priority === "High"
      ? "high-priority-due-tomorrow"
      : "due-tomorrow";
  }

  return null;
};

const buildReminderEmailHtml = (task, reminderType) => {
  const reminder = REMINDER_TYPES[reminderType];
  const dueDate = new Date(task.dueDate).toLocaleDateString("en", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric"
  });
  const overdueWarning = reminderType === "overdue"
    ? "<p style=\"margin:0 0 12px; color:#fda4af; font-weight:700;\">⚠️ This task is overdue and still needs attention.</p>"
    : "";

  return `
    <div style="font-family: Inter, Arial, sans-serif; background:#0f172a; color:#f8fafc; padding:24px;">
      <div style="max-width:640px; margin:0 auto; background:#111827; border:1px solid #273449; border-radius:16px; overflow:hidden;">
        <div style="background:linear-gradient(135deg,#2563eb,#7c3aed); padding:24px 24px 20px;">
          <h2 style="margin:0 0 6px; font-size:24px; color:#fff;">Smart Task Manager</h2>
          <p style="margin:0; color:#dbeafe;">A friendly reminder for your task</p>
        </div>
        <div style="padding:24px;">
          <h3 style="margin:0 0 12px; font-size:20px; color:#fff;">${reminder.title}</h3>
          <p style="margin:0 0 16px; color:#cbd5e1;">${reminder.title} for <strong>${task.title}</strong>.</p>
          ${overdueWarning}
          <div style="background:#181f2d; border:1px solid #273449; border-radius:12px; padding:16px; margin-bottom:16px;">
            <p style="margin:0 0 8px; color:#cbd5e1;"><strong>Task:</strong> ${task.title}</p>
            <p style="margin:0 0 8px; color:#cbd5e1;"><strong>Description:</strong> ${task.description || "No description provided"}</p>
            <p style="margin:0 0 8px; color:#cbd5e1;"><strong>Priority:</strong> ${task.priority}</p>
            <p style="margin:0 0 8px; color:#cbd5e1;"><strong>Category:</strong> ${task.category}</p>
            <p style="margin:0 0 8px; color:#cbd5e1;"><strong>Due Date:</strong> ${dueDate}</p>
            <p style="margin:0; color:#cbd5e1;"><strong>Status:</strong> ${task.status}</p>
          </div>
          <a href="${process.env.CLIENT_URL || "http://localhost:5173"}" style="display:inline-block; padding:10px 16px; background:#60a5fa; color:#08111f; font-weight:700; border-radius:999px; text-decoration:none;">Open Smart Task Manager</a>
        </div>
        <div style="padding:0 24px 24px; color:#94a3b8; font-size:12px;">Smart Task Manager • Stay organized and on track</div>
      </div>
    </div>
  `;
};

const getReminderMessage = (task, reminderType) => {
  const reminder = REMINDER_TYPES[reminderType];
  return `${reminder.title}: ${task.title}`;
};

const getReminderTrackingField = (reminderType) => {
  const mapping = {
    "due-today": "dueTodayReminderSentAt",
    "due-tomorrow": "dueTomorrowReminderSentAt",
    overdue: "lastOverdueReminderAt",
    "high-priority-due-tomorrow": "highPriorityDueTomorrowReminderSentAt"
  };

  return mapping[reminderType] || "lastReminderSentAt";
};

export const shouldSendOverdueReminder = (task, currentDate = new Date()) => {
  if (!task || task.status === "Completed") {
    return false;
  }

  const dueDate = new Date(task.dueDate);

  if (!(currentDate > dueDate)) {
    return false;
  }

  const reminderTracking = task.reminderTracking || {};
  const lastOverdueReminderAt = reminderTracking.lastOverdueReminderAt || reminderTracking.overdueReminderSentAt;

  if (!lastOverdueReminderAt) {
    return true;
  }

  return currentDate.getTime() - new Date(lastOverdueReminderAt).getTime() >= OVERDUE_REMINDER_INTERVAL_MS;
};

export const createNotification = async ({ userId, title, message, type = "info", relatedTask = null }) => {
  const notification = await Notification.create({ userId, title, message, type, relatedTask });
  return notification;
};

export const createTaskNotification = async ({ userId, title, message, type = "info", relatedTask = null }) => {
  const existingNotification = await Notification.findOne({ userId, relatedTask, title });

  if (existingNotification) {
    return existingNotification;
  }

  return createNotification({ userId, title, message, type, relatedTask });
};

export const markAsRead = async (notificationId, userId) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, userId },
    { isRead: true },
    { new: true }
  );

  if (!notification) {
    throw new AppError("Notification not found.", 404);
  }

  return notification;
};

export const markAllAsRead = async (userId) => {
  await Notification.updateMany({ userId, isRead: false }, { isRead: true });
};

export const deleteNotification = async (notificationId, userId) => {
  const notification = await Notification.findOneAndDelete({ _id: notificationId, userId });

  if (!notification) {
    throw new AppError("Notification not found.", 404);
  }

  return notification;
};

export const deleteAllNotifications = async (userId) => {
  const result = await Notification.deleteMany({ userId });
  return { deletedCount: result.deletedCount || 0 };
};

export const getNotifications = async ({ userId, page = 1, limit = 10, filter = "all" }) => {
  const normalizedLimit = Math.min(50, Math.max(1, Number(limit) || 10));
  const normalizedPage = Math.max(1, Number(page) || 1);
  const query = { userId };

  if (filter === "unread") {
    query.isRead = false;
  } else if (filter === "read") {
    query.isRead = true;
  }

  const [notifications, totalNotifications] = await Promise.all([
    Notification.find(query).sort({ createdAt: -1 }).skip((normalizedPage - 1) * normalizedLimit).limit(normalizedLimit).lean(),
    Notification.countDocuments(query)
  ]);

  return {
    notifications,
    currentPage: normalizedPage,
    totalPages: Math.max(1, Math.ceil(totalNotifications / normalizedLimit)),
    totalNotifications
  };
};

export const getUnreadCount = async (userId) => {
  const count = await Notification.countDocuments({ userId, isRead: false });
  return count;
};

export const sendTaskReminderEmails = async (currentDate = new Date()) => {
  const endOfTomorrow = new Date(currentDate);
  endOfTomorrow.setDate(endOfTomorrow.getDate() + 1);
  endOfTomorrow.setHours(23, 59, 59, 999);

  const tasks = await Task.find({
    status: { $ne: "Completed" },
    dueDate: { $lte: endOfTomorrow }
  }).populate("userId", "email name");

  for (const task of tasks) {
    try {
      const reminderType = getReminderTypeForTask(task, currentDate);

      if (!reminderType) {
        continue;
      }

      const reminderTracking = task.reminderTracking || {};
      const reminderField = getReminderTrackingField(reminderType);

      if (reminderType === "overdue") {
        if (!shouldSendOverdueReminder(task, currentDate)) {
          continue;
        }
      } else if (reminderTracking[reminderField]) {
        continue;
      }

      if (!task.userId?.email) {
        continue;
      }

      const message = getReminderMessage(task, reminderType);

      await createNotification({
        userId: task.userId._id,
        title: REMINDER_TYPES[reminderType].title,
        message,
        type: REMINDER_TYPES[reminderType].type,
        relatedTask: task._id
      });

      try {
        await sendEmail({
          to: task.userId.email,
          subject: reminderType === "overdue"
            ? "Task Overdue - Smart Task Manager"
            : `${REMINDER_TYPES[reminderType].title} - Smart Task Manager`,
          html: buildReminderEmailHtml(task, reminderType)
        });
      } catch (emailError) {
        console.error("Email sending failed:", emailError.message);
      }

      task.reminderTracking = {
        ...reminderTracking,
        [reminderField]: new Date(),
        lastReminderSentAt: new Date(),
        ...(reminderType === "overdue"
          ? {
              lastOverdueReminderAt: new Date(),
              overdueReminderSentAt: new Date()
            }
          : {})
      };

      await task.save();
    } catch (err) {
      console.error(`Failed processing task "${task.title}"`, err);
    }
  }
};
