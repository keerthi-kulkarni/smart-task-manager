import { Bell } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getErrorMessage } from "../../services/api.js";
import * as notificationService from "../../services/notificationService.js";
import styles from "./NotificationBell.module.css";

const NotificationBell = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  const refreshNotifications = async () => {
    try {
      const [payload, unreadPayload] = await Promise.all([
        notificationService.getNotifications({ page: 1, limit: 5 }),
        notificationService.getUnreadCount()
      ]);
      setNotifications(payload.notifications || []);
      setUnreadCount(unreadPayload.count || 0);
      setHasAnimated(true);
    } catch (error) {
      console.error(getErrorMessage(error));
    }
  };

  useEffect(() => {
    refreshNotifications();
    const timer = window.setInterval(refreshNotifications, 60000);
    const listener = () => {
      refreshNotifications();
    };

    window.addEventListener("notifications:refresh", listener);

    return () => {
      window.clearInterval(timer);
      window.removeEventListener("notifications:refresh", listener);
    };
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllNotificationsAsRead();
      await refreshNotifications();
    } catch (error) {
      console.error(getErrorMessage(error));
    }
  };

  const handleRead = async (id) => {
    try {
      await notificationService.markNotificationAsRead(id);
      await refreshNotifications();
    } catch (error) {
      console.error(getErrorMessage(error));
    }
  };

  const handleDelete = async (id) => {
    try {
      await notificationService.deleteNotification(id);
      await refreshNotifications();
    } catch (error) {
      console.error(getErrorMessage(error));
    }
  };

  const badgeClassName = useMemo(() => `${styles.badge} ${hasAnimated ? styles.pulse : ""}`.trim(), [hasAnimated]);

  return (
    <div className={styles.wrapper}>
      <button type="button" className={styles.button} onClick={() => setIsOpen((current) => !current)}>
        <Bell size={18} />
        {unreadCount > 0 && <span className={badgeClassName}>{unreadCount}</span>}
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.header}>
            <strong>Notifications</strong>
            {unreadCount > 0 && (
              <button type="button" className={styles.linkButton} onClick={handleMarkAllRead}>
                Mark all read
              </button>
            )}
          </div>

          <div className={styles.list}>
            {isLoading && <div className={styles.empty}>Loading notifications...</div>}
            {!isLoading && notifications.length === 0 && <div className={styles.empty}>No notifications yet</div>}
            {!isLoading &&
              notifications.map((item) => (
                <div key={item._id} className={`${styles.item} ${item.isRead ? "" : styles.unread}`}>
                  <div className={styles.itemMain}>
                    <span className={styles.icon}>{item.type === "error" ? "⚠️" : item.type === "success" ? "✅" : item.type === "warning" ? "🔔" : "ℹ️"}</span>
                    <div className={styles.content}>
                      <strong>{item.title}</strong>
                      <p>{item.message}</p>
                      <small>{new Date(item.createdAt).toLocaleString()}</small>
                    </div>
                  </div>
                  <div className={styles.actions}>
                    {!item.isRead && (
                      <button type="button" className={styles.linkButton} onClick={() => handleRead(item._id)}>
                        Mark read
                      </button>
                    )}
                    <button type="button" className={styles.linkButton} onClick={() => handleDelete(item._id)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
          </div>

          <div className={styles.footer}>
            <button type="button" className={styles.linkButton} onClick={() => {
              setIsOpen(false);
              navigate("/notifications");
            }}>
              View all
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
