import ActivityLog from "../models/ActivityLog.js";
import Task, { TASK_CATEGORIES, TASK_PRIORITIES, TASK_STATUSES } from "../models/Task.js";

const toPercentage = (completed, total) => {
  if (!total) {
    return 0;
  }

  return Math.round((completed / total) * 100);
};

const buildDistribution = (labels, counts) =>
  labels.map((label) => ({
    name: label,
    value: counts[label] || 0
  }));

export const calculateCompletionStreak = async (userId) => {
  const completedTasks = await Task.find({
    userId,
    status: "Completed",
    completedAt: { $ne: null }
  })
    .select("completedAt")
    .sort({ completedAt: -1 })
    .lean();

  const completedDays = new Set(
    completedTasks.map((task) => new Date(task.completedAt).toISOString().slice(0, 10))
  );

  let streak = 0;
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  while (completedDays.has(cursor.toISOString().slice(0, 10))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
};

export const getDashboardStats = async (userId) => {
  const now = new Date();

  const [total, completed, pending, inProgress, overdue, statusAgg, categoryAgg, priorityAgg, streak, recentActivity] =
    await Promise.all([
      Task.countDocuments({ userId }),
      Task.countDocuments({ userId, status: "Completed" }),
      Task.countDocuments({ userId, status: "Pending" }),
      Task.countDocuments({ userId, status: "In Progress" }),
      Task.countDocuments({ userId, status: { $ne: "Completed" }, dueDate: { $lt: now } }),
      Task.aggregate([
        { $match: { userId } },
        { $group: { _id: "$status", value: { $sum: 1 } } }
      ]),
      Task.aggregate([
        { $match: { userId } },
        { $group: { _id: "$category", value: { $sum: 1 } } }
      ]),
      Task.aggregate([
        { $match: { userId } },
        { $group: { _id: "$priority", value: { $sum: 1 } } }
      ]),
      calculateCompletionStreak(userId),
      ActivityLog.find({ userId }).sort({ createdAt: -1 }).limit(8).lean()
    ]);

  const statusCounts = statusAgg.reduce((acc, item) => ({ ...acc, [item._id]: item.value }), {});
  const categoryCounts = categoryAgg.reduce((acc, item) => ({ ...acc, [item._id]: item.value }), {});
  const priorityCounts = priorityAgg.reduce((acc, item) => ({ ...acc, [item._id]: item.value }), {});

  return {
    cards: {
      total,
      completed,
      pending,
      inProgress,
      overdue,
      completionPercentage: toPercentage(completed, total),
      completionStreak: streak
    },
    charts: {
      statusDistribution: buildDistribution([...TASK_STATUSES, "Overdue"], {
        ...statusCounts,
        Overdue: overdue
      }),
      categoryDistribution: buildDistribution(TASK_CATEGORIES, categoryCounts),
      priorityDistribution: buildDistribution(TASK_PRIORITIES, priorityCounts)
    },
    recentActivity
  };
};
