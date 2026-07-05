import assert from "node:assert/strict";
import test from "node:test";
import { getReminderTypeForTask, shouldSendOverdueReminder } from "../services/notificationService.js";

test("getReminderTypeForTask identifies due today reminders", () => {
  const task = {
    status: "Pending",
    dueDate: new Date("2026-07-05T17:00:00.000Z"),
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

test("getReminderTypeForTask returns overdue when the deadline has already passed for the same day", () => {
  const task = {
    status: "Pending",
    dueDate: new Date("2026-07-05T17:00:00.000Z"),
    priority: "Low"
  };

  assert.equal(getReminderTypeForTask(task, new Date("2026-07-05T17:01:00.000Z")), "overdue");
});

test("shouldSendOverdueReminder allows the first overdue reminder immediately", () => {
  const task = {
    status: "Pending",
    dueDate: new Date("2026-07-05T17:00:00.000Z"),
    reminderTracking: {}
  };

  assert.equal(shouldSendOverdueReminder(task, new Date("2026-07-05T17:01:00.000Z")), true);
});

test("shouldSendOverdueReminder skips reminders sent within the last hour", () => {
  const task = {
    status: "Pending",
    dueDate: new Date("2026-07-05T17:00:00.000Z"),
    reminderTracking: {
      lastOverdueReminderAt: new Date("2026-07-05T17:30:00.000Z")
    }
  };

  assert.equal(shouldSendOverdueReminder(task, new Date("2026-07-05T17:45:00.000Z")), false);
});

test("shouldSendOverdueReminder allows another overdue reminder after one hour", () => {
  const task = {
    status: "Pending",
    dueDate: new Date("2026-07-05T17:00:00.000Z"),
    reminderTracking: {
      lastOverdueReminderAt: new Date("2026-07-05T16:00:00.000Z")
    }
  };

  assert.equal(shouldSendOverdueReminder(task, new Date("2026-07-05T17:01:00.000Z")), true);
});

test("getReminderTypeForTask returns null when no reminder applies", () => {
  const task = {
    status: "Completed",
    dueDate: new Date("2026-07-06T09:00:00.000Z"),
    priority: "Low"
  };

  assert.equal(getReminderTypeForTask(task, new Date("2026-07-05T12:00:00.000Z")), null);
});
