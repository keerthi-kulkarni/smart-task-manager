import assert from "node:assert/strict";
import test from "node:test";
import { getReminderTypeForTask } from "../services/notificationService.js";

test("getReminderTypeForTask identifies due today reminders", () => {
  const task = {
    status: "Pending",
    dueDate: new Date("2026-07-05T09:00:00.000Z"),
    priority: "High"
  };

  assert.equal(getReminderTypeForTask(task, new Date("2026-07-05T12:00:00.000Z")), "due-today");
});

test("getReminderTypeForTask identifies high priority due tomorrow reminders", () => {
  const task = {
    status: "Pending",
    dueDate: new Date("2026-07-06T09:00:00.000Z"),
    priority: "High"
  };

  assert.equal(getReminderTypeForTask(task, new Date("2026-07-05T12:00:00.000Z")), "high-priority-due-tomorrow");
});

test("getReminderTypeForTask returns null when no reminder applies", () => {
  const task = {
    status: "Completed",
    dueDate: new Date("2026-07-06T09:00:00.000Z"),
    priority: "Low"
  };

  assert.equal(getReminderTypeForTask(task, new Date("2026-07-05T12:00:00.000Z")), null);
});
