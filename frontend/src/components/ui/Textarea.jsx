import styles from "./FormControls.module.css";

const Textarea = ({ label, error, className = "", ...props }) => (
  <label className={`${styles.field} ${className}`}>
    {label && <span>{label}</span>}
    <textarea className={`${styles.control} ${styles.textarea}`} {...props} />
    {error && <small className={styles.error}>{error}</small>}
  </label>
);

export default Textarea;
