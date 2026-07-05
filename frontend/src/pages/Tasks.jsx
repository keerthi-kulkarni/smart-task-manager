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

const refreshNotifications = () => {
  window.dispatchEvent(new CustomEvent("notifications:refresh"));
};

const initialFilters = {
  search: "",
  status: "",
  priority: "",
  due: "",
  sort: "newest"
};

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalTasks: 0 });
  const [filters, setFilters] = useState(initialFilters);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const debouncedSearch = useDebounce(filters.search, 400);
  const query = useMemo(
    () => ({
      ...filters,
      search: debouncedSearch,
      page: 1,
      limit: 12
    }),
    [filters, debouncedSearch]
  );

  const loadTasks = useCallback(async () => {
    setIsLoading(true);

    try {
      const data = await taskService.getTasks(query);
      setTasks(data.tasks);
      setPagination({
        currentPage: data.currentPage,
        totalPages: data.totalPages,
        totalTasks: data.totalTasks
      });
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

  const handleClearFilters = () => {
    setFilters(initialFilters);
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
      refreshNotifications();
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
      refreshNotifications();
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
      refreshNotifications();
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
        onClear={handleClearFilters}
        onCreate={openCreateModal}
        onExport={handleExport}
        taskCount={pagination.totalTasks}
        resultLabel={pagination.totalTasks === 1 ? "1 task" : `${pagination.totalTasks} tasks`}
      />

      {isLoading ? (
        <Spinner label="Loading tasks" />
      ) : tasks.length ? (
        <>
          <p className={styles.resultsSummary}>Showing {pagination.totalTasks} task{pagination.totalTasks === 1 ? "" : "s"}</p>
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
        </>
      ) : (
        <EmptyState
          title="No matching tasks found"
          message="Adjust the active filters or create a fresh task."
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
