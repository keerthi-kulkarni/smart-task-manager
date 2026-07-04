export const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(date));

export const formatDateTime = (date) =>
  new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(date));

export const toDateTimeLocalValue = (date) => {
  const value = date ? new Date(date) : new Date(Date.now() + 24 * 60 * 60 * 1000);
  const offset = value.getTimezoneOffset();
  const local = new Date(value.getTime() - offset * 60 * 1000);

  return local.toISOString().slice(0, 16);
};

export const isOverdue = (task) =>
  task?.status !== "Completed" && new Date(task?.dueDate).getTime() < Date.now();

export const getSuggestedPriority = (date) => {
  const dueTime = new Date(date).getTime();

  if (Number.isNaN(dueTime)) {
    return "Low";
  }

  const diffInDays = Math.ceil((dueTime - Date.now()) / (1000 * 60 * 60 * 24));

  if (diffInDays <= 1) {
    return "High";
  }

  if (diffInDays <= 3) {
    return "Medium";
  }

  return "Low";
};
