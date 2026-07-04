import { CalendarClock, CheckCircle2, Pencil, Trash2 } from "lucide-react";
import { formatDateTime, isOverdue } from "../../utils/date.js";
import Button from "../ui/Button.jsx";
import styles from "./TaskCard.module.css";

const TaskCard = ({ task, onComplete, onDelete, onEdit }) => {
  const overdue = isOverdue(task);

  return (
    <article className={`${styles.card} ${overdue ? styles.overdue : ""}`}>
      <div className={styles.header}>
        <div>
          <div className={styles.badges}>
            <span className={`${styles.badge} ${styles[task.priority.toLowerCase()]}`}>{task.priority}</span>
            <span className={`${styles.badge} ${styles.status}`}>{overdue ? "Overdue" : task.status}</span>
          </div>
          <h3>{task.title}</h3>
        </div>
        <span className={styles.category}>{task.category}</span>
      </div>

      {task.description && <p className={styles.description}>{task.description}</p>}

      <div className={styles.meta}>
        <CalendarClock size={17} />
        <span>{formatDateTime(task.dueDate)}</span>
      </div>

      <footer className={styles.actions}>
        {task.status !== "Completed" && (
          <Button type="button" variant="success" onClick={() => onComplete(task)}>
            <CheckCircle2 size={16} />
            Complete
          </Button>
        )}
        <Button type="button" variant="secondary" onClick={() => onEdit(task)}>
          <Pencil size={16} />
          Edit
        </Button>
        <Button type="button" variant="dangerGhost" size="icon" onClick={() => onDelete(task)} aria-label="Delete task">
          <Trash2 size={17} />
        </Button>
      </footer>
    </article>
  );
};

export default TaskCard;
