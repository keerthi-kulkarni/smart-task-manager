import { useEffect, useMemo, useState } from "react";
import { TASK_CATEGORIES, TASK_FORM_STATUSES, TASK_PRIORITIES } from "../../utils/constants.js";
import { getSuggestedPriority, toDateTimeLocalValue } from "../../utils/date.js";
import Button from "../ui/Button.jsx";
import Input from "../ui/Input.jsx";
import Select from "../ui/Select.jsx";
import Textarea from "../ui/Textarea.jsx";
import styles from "./TaskForm.module.css";

const buildInitialState = (task) => ({
  title: task?.title || "",
  description: task?.description || "",
  priority: task?.priority || "Low",
  status: task?.status || "Pending",
  category: task?.category || "Study",
  dueDate: toDateTimeLocalValue(task?.dueDate)
});

const TaskForm = ({ initialTask, isSubmitting, onCancel, onSubmit }) => {
  const [form, setForm] = useState(() => buildInitialState(initialTask));
  const [priorityTouched, setPriorityTouched] = useState(Boolean(initialTask));

  const suggestedPriority = useMemo(() => getSuggestedPriority(form.dueDate), [form.dueDate]);

  useEffect(() => {
    setForm(buildInitialState(initialTask));
    setPriorityTouched(Boolean(initialTask));
  }, [initialTask]);

  useEffect(() => {
    if (!priorityTouched) {
      setForm((current) => ({ ...current, priority: suggestedPriority }));
    }
  }, [priorityTouched, suggestedPriority]);

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      ...form,
      dueDate: new Date(form.dueDate).toISOString()
    });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <Input
        label="Title"
        required
        placeholder="Task title"
        value={form.title}
        onChange={(event) => updateField("title", event.target.value)}
      />
      <Textarea
        label="Description"
        rows={4}
        placeholder="Add useful context"
        value={form.description}
        onChange={(event) => updateField("description", event.target.value)}
      />
      <div className={styles.grid}>
        <Select
          label="Category"
          options={TASK_CATEGORIES}
          value={form.category}
          onChange={(event) => updateField("category", event.target.value)}
        />
        <Select
          label="Status"
          options={TASK_FORM_STATUSES}
          value={form.status}
          onChange={(event) => updateField("status", event.target.value)}
        />
      </div>
      <div className={styles.grid}>
        <Input
          label="Due Date"
          required
          type="datetime-local"
          value={form.dueDate}
          onChange={(event) => updateField("dueDate", event.target.value)}
        />
        <Select
          label="Priority"
          options={TASK_PRIORITIES}
          value={form.priority}
          onChange={(event) => {
            setPriorityTouched(true);
            updateField("priority", event.target.value);
          }}
        />
      </div>
      <div className={styles.suggestion}>
        <span>Suggested priority</span>
        <strong>{suggestedPriority}</strong>
      </div>
      <footer className={styles.actions}>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {initialTask ? "Save Changes" : "Create Task"}
        </Button>
      </footer>
    </form>
  );
};

export default TaskForm;
