import { Download, Plus, Search } from "lucide-react";
import { TASK_CATEGORIES, TASK_PRIORITIES, TASK_STATUSES } from "../../utils/constants.js";
import Button from "../ui/Button.jsx";
import Input from "../ui/Input.jsx";
import Select from "../ui/Select.jsx";
import styles from "./TaskToolbar.module.css";

const TaskToolbar = ({ filters, onChange, onCreate, onExport, taskCount }) => (
  <section className={styles.toolbar}>
    <div className={styles.topRow}>
      <div>
        <p className={styles.eyebrow}>{taskCount} tasks</p>
        <h2>Task Board</h2>
      </div>
      <div className={styles.actions}>
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
        options={TASK_STATUSES}
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
        aria-label="Filter by category"
        placeholder="All categories"
        options={TASK_CATEGORIES}
        value={filters.category}
        onChange={(event) => onChange("category", event.target.value)}
      />
      <Select
        aria-label="Sort tasks"
        options={[
          { label: "Newest First", value: "newest" },
          { label: "Oldest First", value: "oldest" },
          { label: "Due Date", value: "dueDate" },
          { label: "Priority", value: "priority" }
        ]}
        value={filters.sort}
        onChange={(event) => onChange("sort", event.target.value)}
      />
    </div>
  </section>
);

export default TaskToolbar;
