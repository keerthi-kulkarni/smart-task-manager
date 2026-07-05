import mongoose from "mongoose";

export const TASK_PRIORITIES = ["High", "Medium", "Low"];
export const TASK_STATUSES = ["Pending", "In Progress", "Completed"];
export const TASK_CATEGORIES = ["Study", "Work", "Personal", "Health"];

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Task title is required."],
      trim: true,
      maxlength: [140, "Title cannot exceed 140 characters."]
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1200, "Description cannot exceed 1200 characters."],
      default: ""
    },
    priority: {
      type: String,
      enum: TASK_PRIORITIES,
      required: true
    },
    status: {
      type: String,
      enum: TASK_STATUSES,
      default: "Pending"
    },
    category: {
      type: String,
      enum: TASK_CATEGORIES,
      required: true
    },
    dueDate: {
      type: Date,
      required: [true, "Due date is required."]
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    completedAt: {
      type: Date,
      default: null
    },
    reminderTracking: {
      lastReminderSentAt: {
        type: Date,
        default: null
      },
      dueTodayReminderSentAt: {
        type: Date,
        default: null
      },
      dueTomorrowReminderSentAt: {
        type: Date,
        default: null
      },
      overdueReminderSentAt: {
        type: Date,
        default: null
      },
      highPriorityDueTomorrowReminderSentAt: {
        type: Date,
        default: null
      }
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(_doc, ret) {
        delete ret.__v;
        return ret;
      }
    },
    toObject: {
      virtuals: true
    }
  }
);

taskSchema.virtual("isOverdue").get(function getIsOverdue() {
  return this.status !== "Completed" && this.dueDate < new Date();
});

taskSchema.index({ userId: 1, dueDate: 1 });
taskSchema.index({ userId: 1, status: 1 });
taskSchema.index({ userId: 1, priority: 1 });
taskSchema.index({ userId: 1, category: 1 });
taskSchema.index({ title: "text", description: "text" });

const Task = mongoose.model("Task", taskSchema);

export default Task;
