const escapeCsvValue = (value) => {
  if (value === null || value === undefined) {
    return "";
  }

  const stringValue = String(value).replace(/"/g, '""');
  return /[",\n]/.test(stringValue) ? `"${stringValue}"` : stringValue;
};

export const buildTasksCsv = (tasks) => {
  const headers = [
    "Title",
    "Description",
    "Priority",
    "Status",
    "Category",
    "Due Date",
    "Created At",
    "Completed At"
  ];

  const rows = tasks.map((task) => [
    task.title,
    task.description,
    task.priority,
    task.status,
    task.category,
    task.dueDate?.toISOString(),
    task.createdAt?.toISOString(),
    task.completedAt?.toISOString() || ""
  ]);

  return [headers, ...rows].map((row) => row.map(escapeCsvValue).join(",")).join("\n");
};
