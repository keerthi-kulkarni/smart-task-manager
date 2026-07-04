import { Download, Plus, Search, XCircle } from "lucide-react";
import { TASK_PRIORITIES, TASK_STATUSES } from "../../utils/constants.js";
import Button from "../ui/Button.jsx";
import Input from "../ui/Input.jsx";
import Select from "../ui/Select.jsx";
import styles from "./TaskToolbar.module.css";

const sortOptions = [
  { label: "Newest First", value: "newest" },
  { label: "Oldest First", value: "oldest" },
  { label: "Priority High → Low", value: "priority-high" },
  { label: "Priority Low → High", value: "priority-low" },
  { label: "Due Date Asc", value: "dueDate-asc" },
  { label: "Due Date Desc", value: "dueDate-desc" }
];

const dueOptions = [
  { label: "All Dates", value: "" },
  { label: "Today", value: "today" },
  { label: "This Week", value: "this-week" },
  { label: "Overdue", value: "overdue" }
];

const TaskToolbar = ({ filters, onChange, onClear, onCreate, onExport, taskCount, resultLabel }) => {
  const hasFilters = Boolean(filters.search || filters.status || filters.priority || filters.due || filters.sort !== "newest");

  return (
    <section className={styles.toolbar}>
      <div className={styles.topRow}>
        <div>
          <p className={styles.eyebrow}>{resultLabel || `${taskCount} tasks`}</p>
          <h2>Task Board</h2>
        </div>
        <div className={styles.actions}>
          {hasFilters && (
            <Button type="button" variant="secondary" onClick={onClear}>
              <XCircle size={17} />
              Clear Filters
            </Button>
          )}
          <Button type="button" variant="secondary" onClick={onExport}>
            <Download size={17} />
            Export CSV
          </Button>
          <Button type="button" onClick={onCreate}>
            <Plus size={18} />
            New Task
          </Button>
        </div>
      </div>

      <div className={styles.filters}>
        <Input
          aria-label="Search tasks"
          icon={<Search size={17} />}
          placeholder="Search title or description"
          value={filters.search}
          onChange={(event) => onChange("search", event.target.value)}
        />
        <Select
          aria-label="Filter by status"
          placeholder="All statuses"
          options={TASK_STATUSES.filter((status) => status !== "Overdue")}
          value={filters.status}
          onChange={(event) => onChange("status", event.target.value)}
        />
        <Select
          aria-label="Filter by priority"
          placeholder="All priorities"
          options={TASK_PRIORITIES}
          value={filters.priority}
          onChange={(event) => onChange("priority", event.target.value)}
        />
        <Select
          aria-label="Filter by due date"
          options={dueOptions}
          value={filters.due}
          onChange={(event) => onChange("due", event.target.value)}
        />
        <Select
          aria-label="Sort tasks"
          options={sortOptions}
          value={filters.sort}
          onChange={(event) => onChange("sort", event.target.value)}
        />
      </div>
    </section>
  );
};

export default TaskToolbar;
