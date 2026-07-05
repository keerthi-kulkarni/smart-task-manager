import Task from "../models/Task.js";
import { createActivityLog } from "../services/activityService.js";
import { buildTasksCsv } from "../services/csvService.js";
import { createTaskNotification } from "../services/notificationService.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { buildTaskQuery, getPaginationOptions, getTaskSortOption } from "../utils/taskQuery.js";
import { getSuggestedPriority, isTaskOverdue } from "../utils/taskUtils.js";

const findOwnedTask = async (taskId, userId) => {
  const task = await Task.findOne({ _id: taskId, userId });

  if (!task) {
    throw new AppError("Task not found.", 404);
  }

  return task;
};

export const getTasks = asyncHandler(async (req, res) => {
  const { status, priority, search, due, sort = "newest", page, limit } = req.query;
  const pagination = getPaginationOptions({ page, limit });
  const query = buildTaskQuery(req.user._id, { status, priority, search, due });
  const sortOption = getTaskSortOption(sort);

  const [tasks, totalTasks] = await Promise.all([
    Task.find(query)
      .sort(sortOption)
      .skip((pagination.page - 1) * pagination.limit)
      .limit(pagination.limit)
      .lean(),
    Task.countDocuments(query)
  ]);

  res.status(200).json({
    tasks,
    currentPage: pagination.page,
    totalPages: Math.max(1, Math.ceil(totalTasks / pagination.limit)),
    totalTasks
  });
});

export const exportTasksCsv = asyncHandler(async (req, res) => {
  const query = buildTaskQuery(req.user._id, req.query);
  const tasks = await Task.find(query).sort({ createdAt: -1 }).lean();
  const csv = buildTasksCsv(tasks);

  res.header("Content-Type", "text/csv");
  res.attachment("smart-tasks.csv");
  res.send(csv);
});

export const getTask = asyncHandler(async (req, res) => {
  const task = await findOwnedTask(req.params.id, req.user._id);

  res.status(200).json({
    task
  });
});

export const createTask = asyncHandler(async (req, res) => {
  const payload = {
    title: req.body.title,
    description: req.body.description || "",
    priority: req.body.priority || getSuggestedPriority(req.body.dueDate),
    status: req.body.status || "Pending",
    category: req.body.category,
    dueDate: req.body.dueDate,
    userId: req.user._id
  };

  if (payload.status === "Completed") {
    payload.completedAt = new Date();
  }

  const task = await Task.create(payload);

  await createActivityLog({
    userId: req.user._id,
    action: "created_task",
    entity: "task",
    entityId: task._id,
    message: `Created "${task.title}"`,
    metadata: {
      priority: task.priority,
      category: task.category
    }
  });

  await createTaskNotification({
    userId: req.user._id,
    title: "Task created",
    message: `Task "${task.title}" was created.`,
    type: "success",
    relatedTask: task._id
  });

  res.status(201).json({
    task,
    suggestedPriority: getSuggestedPriority(task.dueDate),
    isOverdue: isTaskOverdue(task)
  });
});

export const updateTask = asyncHandler(async (req, res) => {
  const task = await findOwnedTask(req.params.id, req.user._id);
  const previousStatus = task.status;

  ["title", "description", "priority", "status", "category", "dueDate"].forEach((field) => {
    if (req.body[field] !== undefined) {
      task[field] = req.body[field];
    }
  });

  if (task.status === "Completed" && previousStatus !== "Completed") {
    task.completedAt = new Date();
  }

  if (task.status !== "Completed") {
    task.completedAt = null;
  }

  await task.save();

  await createActivityLog({
    userId: req.user._id,
    action: "updated_task",
    entity: "task",
    entityId: task._id,
    message: `Updated "${task.title}"`,
    metadata: {
      status: task.status,
      priority: task.priority
    }
  });

  await createTaskNotification({
    userId: req.user._id,
    title: "Task updated",
    message: `Task "${task.title}" was updated.`,
    type: "info",
    relatedTask: task._id
  });

  if (task.status === "Completed") {
    await createTaskNotification({
      userId: req.user._id,
      title: "Task completed",
      message: `Congratulations! You completed "${task.title}".`,
      type: "success",
      relatedTask: task._id
    });
  }

  res.status(200).json({
    task,
    isOverdue: isTaskOverdue(task)
  });
});

export const deleteTask = asyncHandler(async (req, res) => {
  const task = await findOwnedTask(req.params.id, req.user._id);

  await task.deleteOne();

  await createActivityLog({
    userId: req.user._id,
    action: "deleted_task",
    entity: "task",
    entityId: task._id,
    message: `Deleted "${task.title}"`
  });

  await createTaskNotification({
    userId: req.user._id,
    title: "Task deleted",
    message: `Task "${task.title}" was deleted.`,
    type: "warning",
    relatedTask: task._id
  });

  res.status(200).json({
    message: "Task deleted successfully."
  });
});
