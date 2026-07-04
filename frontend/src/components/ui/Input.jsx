import styles from "./FormControls.module.css";

const Input = ({ label, error, icon, className = "", ...props }) => (
  <label className={`${styles.field} ${className}`}>
    {label && <span>{label}</span>}
    <div className={styles.controlWrap}>
      {icon && <span className={styles.icon}>{icon}</span>}
      <input className={`${styles.control} ${icon ? styles.withIcon : ""}`} {...props} />
    </div>
    {error && <small className={styles.error}>{error}</small>}
  </label>
);

export default Input;
