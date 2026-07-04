const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const getTodayRange = () => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date();
  end.setHours(23, 59, 59, 999);

  return { $gte: start, $lte: end };
};

const getThisWeekRange = () => {
  const start = new Date();
  const day = start.getDay();
  const diff = (day + 6) % 7;
  start.setDate(start.getDate() - diff);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);

  return { $gte: start, $lte: end };
};

export const buildTaskQuery = (userId, filters = {}) => {
  const query = { userId };
  const { status, priority, search, due } = filters;

  if (status) {
    query.status = status;
  }

  if (priority) {
    query.priority = priority;
  }

  if (search) {
    const normalizedSearch = escapeRegExp(search.trim());

    query.$or = [
      { title: { $regex: normalizedSearch, $options: "i" } },
      { description: { $regex: normalizedSearch, $options: "i" } }
    ];
  }

  if (due === "today") {
    query.dueDate = getTodayRange();
  } else if (due === "this-week") {
    query.dueDate = getThisWeekRange();
  } else if (due === "overdue") {
    query.status = query.status || { $ne: "Completed" };
    query.dueDate = { $lt: new Date() };
  }

  return query;
};

export const getPaginationOptions = (query = {}) => {
  const page = Math.max(1, Number.parseInt(query.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, Number.parseInt(query.limit, 10) || 10));

  return { page, limit };
};

const priorityWeight = {
  High: 1,
  Medium: 2,
  Low: 3
};

export const getTaskSortOption = (sort = "newest") => {
  switch (sort) {
    case "oldest":
      return { createdAt: 1 };
    case "priority-high":
      return { priority: 1 };
    case "priority-low":
      return { priority: -1 };
    case "dueDate-asc":
      return { dueDate: 1 };
    case "dueDate-desc":
      return { dueDate: -1 };
    case "newest":
    default:
      return { createdAt: -1 };
  }
};

export const applyTaskSorting = (tasks, sort = "newest") => {
  const sortedTasks = [...tasks];

  switch (sort) {
    case "oldest":
      sortedTasks.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      break;
    case "priority-high":
      sortedTasks.sort((a, b) => priorityWeight[a.priority] - priorityWeight[b.priority]);
      break;
    case "priority-low":
      sortedTasks.sort((a, b) => priorityWeight[b.priority] - priorityWeight[a.priority]);
      break;
    case "dueDate-asc":
      sortedTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
      break;
    case "dueDate-desc":
      sortedTasks.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));
      break;
    case "newest":
    default:
      sortedTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      break;
  }

  return sortedTasks;
};
