import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Button from "../components/ui/Button.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import Spinner from "../components/ui/Spinner.jsx";
import { getErrorMessage } from "../services/api.js";
import * as notificationService from "../services/notificationService.js";
import styles from "./Notifications.module.css";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalNotifications: 0 });
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const loadNotifications = async (nextPage = page, nextFilter = filter) => {
    setIsLoading(true);

    try {
      const data = await notificationService.getNotifications({ page: nextPage, limit: 8, filter: nextFilter });
      setNotifications(data.notifications || []);
      setPagination({
        currentPage: data.currentPage,
        totalPages: data.totalPages,
        totalNotifications: data.totalNotifications
      });
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications(1, filter);
  }, [filter]);

  const handleRead = async (id) => {
    try {
      await notificationService.markNotificationAsRead(id);
      await loadNotifications(page, filter);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleDelete = async (id) => {
    try {
      await notificationService.deleteNotification(id);
      await loadNotifications(page, filter);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllNotificationsAsRead();
      await loadNotifications(page, filter);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div className={styles.page}>
      <section className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Notifications</p>
          <h1>Inbox</h1>
        </div>
        <div className={styles.controls}>
          <select value={filter} onChange={(event) => { setFilter(event.target.value); setPage(1); }}>
            <option value="all">All</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
          </select>
          <Button type="button" variant="secondary" onClick={handleMarkAllRead}>
            Mark all read
          </Button>
        </div>
      </section>

      {isLoading ? (
        <Spinner label="Loading notifications" />
      ) : notifications.length ? (
        <>
          <div className={styles.list}>
            {notifications.map((item) => (
              <article key={item._id} className={`${styles.card} ${item.isRead ? "" : styles.unread}`}>
                <div className={styles.content}>
                  <div className={styles.topLine}>
                    <strong>{item.title}</strong>
                    {!item.isRead && <span className={styles.badge}>New</span>}
                  </div>
                  <p>{item.message}</p>
                  <small>{new Date(item.createdAt).toLocaleString()}</small>
                </div>
                <div className={styles.actions}>
                  {!item.isRead && (
                    <Button type="button" variant="ghost" onClick={() => handleRead(item._id)}>
                      Mark read
                    </Button>
                  )}
                  <Button type="button" variant="ghost" onClick={() => handleDelete(item._id)}>
                    Delete
                  </Button>
                </div>
              </article>
            ))}
          </div>

          <div className={styles.pagination}>
            <Button type="button" variant="ghost" disabled={page === 1} onClick={() => { const nextPage = page - 1; setPage(nextPage); loadNotifications(nextPage, filter); }}>
              Previous
            </Button>
            <span>Page {pagination.currentPage} of {pagination.totalPages}</span>
            <Button type="button" variant="ghost" disabled={page >= pagination.totalPages} onClick={() => { const nextPage = page + 1; setPage(nextPage); loadNotifications(nextPage, filter); }}>
              Next
            </Button>
          </div>
        </>
      ) : (
        <EmptyState title="No notifications yet" message="You are all caught up." />
      )}
    </div>
  );
};

export default NotificationsPage;
