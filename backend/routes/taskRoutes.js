import express from "express";
import {
  createTask,
  deleteTask,
  exportTasksCsv,
  getTask,
  getTasks,
  updateTask
} from "../controllers/taskController.js";
import { protect } from "../middleware/authMiddleware.js";
import { createTaskValidator, taskIdValidator, updateTaskValidator } from "../middleware/validators.js";

const router = express.Router();

router.use(protect);

router.route("/").get(getTasks).post(createTaskValidator, createTask);
router.get("/export/csv", exportTasksCsv);
router.route("/:id").get(taskIdValidator, getTask).put(updateTaskValidator, updateTask).delete(taskIdValidator, deleteTask);

export default router;
