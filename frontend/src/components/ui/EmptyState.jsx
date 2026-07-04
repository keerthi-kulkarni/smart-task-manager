import { Inbox } from "lucide-react";
import styles from "./EmptyState.module.css";

const EmptyState = ({ title = "Nothing here yet", message, action }) => (
  <div className={styles.empty}>
    <div className={styles.icon}>
      <Inbox size={26} />
    </div>
    <h3>{title}</h3>
    {message && <p>{message}</p>}
    {action}
  </div>
);

export default EmptyState;
