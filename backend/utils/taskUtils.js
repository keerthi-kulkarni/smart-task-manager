export const getSuggestedPriority = (dueDate) => {
  const dueTime = new Date(dueDate).getTime();

  if (Number.isNaN(dueTime)) {
    return "Low";
  }

  const now = Date.now();
  const diffInDays = Math.ceil((dueTime - now) / (1000 * 60 * 60 * 24));

  if (diffInDays <= 1) {
    return "High";
  }

  if (diffInDays <= 3) {
    return "Medium";
  }

  return "Low";
};

export const isTaskOverdue = (task) =>
  task.status !== "Completed" && new Date(task.dueDate).getTime() < Date.now();

export const priorityWeight = {
  High: 1,
  Medium: 2,
  Low: 3
};
