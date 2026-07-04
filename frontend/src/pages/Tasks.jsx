import { Plus } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import TaskCard from "../components/tasks/TaskCard.jsx";
import TaskForm from "../components/tasks/TaskForm.jsx";
import TaskToolbar from "../components/tasks/TaskToolbar.jsx";
import Button from "../components/ui/Button.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import Modal from "../components/ui/Modal.jsx";
import Spinner from "../components/ui/Spinner.jsx";
import useDebounce from "../hooks/useDebounce.js";
import { getErrorMessage } from "../services/api.js";
import * as taskService from "../services/taskService.js";
import styles from "./Tasks.module.css";

const initialFilters = {
  search: "",
  status: "",
  priority: "",
  category: "",
  sort: "newest"
};

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const debouncedSearch = useDebounce(filters.search);
  const query = useMemo(
    () => ({
      ...filters,
      search: debouncedSearch
    }),
    [filters, debouncedSearch]
  );

  const loadTasks = useCallback(async () => {
    setIsLoading(true);

    try {
      const data = await taskService.getTasks(query);
      setTasks(data.tasks);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, [query]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleFilterChange = (field, value) => {
    setFilters((current) => ({
      ...current,
      [field]: value
    }));
  };

  const openCreateModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleSubmit = async (payload) => {
    setIsSubmitting(true);

    try {
      if (editingTask) {
        await taskService.updateTask(editingTask._id, payload);
        toast.success("Task updated");
      } else {
        await taskService.createTask(payload);
        toast.success("Task created");
      }

      setIsModalOpen(false);
      await loadTasks();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleComplete = async (task) => {
    try {
      await taskService.updateTask(task._id, { status: "Completed" });
      toast.success("Task completed");
      await loadTasks();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleDelete = async (task) => {
    if (!window.confirm(`Delete "${task.title}"?`)) {
      return;
    }

    try {
      await taskService.deleteTask(task._id);
      toast.success("Task deleted");
      await loadTasks();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleExport = async () => {
    try {
      await taskService.exportTasksCsv(query);
      toast.success("CSV exported");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div className={styles.page}>
      <TaskToolbar
        filters={filters}
        onChange={handleFilterChange}
        onCreate={openCreateModal}
        onExport={handleExport}
        taskCount={tasks.length}
      />

      {isLoading ? (
        <Spinner label="Loading tasks" />
      ) : tasks.length ? (
        <section className={styles.taskGrid}>
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onComplete={handleComplete}
              onDelete={handleDelete}
              onEdit={openEditModal}
            />
          ))}
        </section>
      ) : (
        <EmptyState
          title="No tasks found"
          message="Create a task or adjust the current filters."
          action={
            <Button type="button" onClick={openCreateModal}>
              <Plus size={18} />
              New Task
            </Button>
          }
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTask ? "Edit Task" : "Create Task"}
      >
        <TaskForm
          initialTask={editingTask}
          isSubmitting={isSubmitting}
          onCancel={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
        />
      </Modal>
    </div>
  );
};

export default Tasks;
