import test from "node:test";
import assert from "node:assert/strict";
import { buildTaskQuery, getPaginationOptions, getTaskSortOption } from "../utils/taskQuery.js";

test("buildTaskQuery combines search, status, priority and due filters", () => {
  const query = buildTaskQuery("user-1", {
    search: "React",
    status: "Pending",
    priority: "High",
    due: "today"
  });

  assert.equal(query.userId, "user-1");
  assert.equal(query.status, "Pending");
  assert.equal(query.priority, "High");
  assert.ok(query.$or);
  assert.equal(query.$or[0].title.$options, "i");
  assert.ok(query.dueDate.$gte);
  assert.ok(query.dueDate.$lte);
});

test("getPaginationOptions normalizes page and limit values", () => {
  const pagination = getPaginationOptions({ page: "3", limit: "20" });

  assert.equal(pagination.page, 3);
  assert.equal(pagination.limit, 20);
});

test("getTaskSortOption returns supported sort definitions", () => {
  assert.deepEqual(getTaskSortOption("newest"), { createdAt: -1 });
  assert.deepEqual(getTaskSortOption("oldest"), { createdAt: 1 });
  assert.deepEqual(getTaskSortOption("dueDate-asc"), { dueDate: 1 });
  assert.deepEqual(getTaskSortOption("dueDate-desc"), { dueDate: -1 });
});
