import styles from "./Spinner.module.css";

const Spinner = ({ label = "Loading", fullScreen = false }) => (
  <div className={fullScreen ? styles.fullScreen : styles.inline}>
    <span className={styles.spinner} />
    <span>{label}</span>
  </div>
);

export default Spinner;
