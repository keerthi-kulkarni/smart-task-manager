import Task from "../models/Task.js";
import { createActivityLog } from "../services/activityService.js";
import { buildTasksCsv } from "../services/csvService.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { getSuggestedPriority, isTaskOverdue, priorityWeight } from "../utils/taskUtils.js";

const buildTaskQuery = (userId, filters) => {
  const query = { userId };
  const { status, priority, category, search } = filters;

  if (status === "Overdue") {
    query.status = { $ne: "Completed" };
    query.dueDate = { $lt: new Date() };
  } else if (status) {
    query.status = status;
  }

  if (priority) {
    query.priority = priority;
  }

  if (category) {
    query.category = category;
  }

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } }
    ];
  }

  return query;
};

const getSortOption = (sort) => {
  switch (sort) {
    case "dueDate":
      return { dueDate: 1 };
    case "oldest":
      return { createdAt: 1 };
    case "newest":
    default:
      return { createdAt: -1 };
  }
};

const findOwnedTask = async (taskId, userId) => {
  const task = await Task.findOne({ _id: taskId, userId });

  if (!task) {
    throw new AppError("Task not found.", 404);
  }

  return task;
};

export const getTasks = asyncHandler(async (req, res) => {
  const { status, priority, category, search, sort = "newest" } = req.query;
  const query = buildTaskQuery(req.user._id, { status, priority, category, search });
  let tasks = await Task.find(query).sort(getSortOption(sort));

  if (sort === "priority") {
    tasks = tasks.sort((a, b) => priorityWeight[a.priority] - priorityWeight[b.priority]);
  }

  res.status(200).json({
    count: tasks.length,
    tasks
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

  res.status(200).json({
    message: "Task deleted successfully."
  });
});
