import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import ActivityLog from "../models/ActivityLog.js";
import Task from "../models/Task.js";
import User from "../models/User.js";

dotenv.config();

const addDays = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};

const seed = async () => {
  await connectDB();

  await Promise.all([User.deleteMany({}), Task.deleteMany({}), ActivityLog.deleteMany({})]);

  const user = await User.create({
    name: "Demo Student",
    email: "demo@example.com",
    password: "password123"
  });

  const tasks = await Task.insertMany([
    {
      title: "Finish React portfolio polish",
      description: "Add screenshots, deployment notes, and clean README sections.",
      priority: "High",
      status: "In Progress",
      category: "Study",
      dueDate: addDays(1),
      userId: user._id
    },
    {
      title: "Review operating systems notes",
      description: "Revise scheduling, memory management, and file systems.",
      priority: "Medium",
      status: "Pending",
      category: "Study",
      dueDate: addDays(3),
      userId: user._id
    },
    {
      title: "Gym session",
      description: "Push workout and mobility work.",
      priority: "Low",
      status: "Completed",
      category: "Health",
      dueDate: addDays(-1),
      completedAt: new Date(),
      userId: user._id
    },
    {
      title: "Submit internship application",
      description: "Customize resume and submit the form.",
      priority: "High",
      status: "Pending",
      category: "Work",
      dueDate: addDays(-2),
      userId: user._id
    }
  ]);

  await ActivityLog.insertMany(
    tasks.map((task) => ({
      userId: user._id,
      action: "created_task",
      entity: "task",
      entityId: task._id,
      message: `Created "${task.title}"`
    }))
  );

  console.log("Seed complete. Login with demo@example.com / password123");
  await mongoose.connection.close();
};

seed().catch(async (error) => {
  console.error(error);
  await mongoose.connection.close();
  process.exit(1);
});
