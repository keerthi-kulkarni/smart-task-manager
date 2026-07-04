import styles from "./StatCard.module.css";

const StatCard = ({ label, value, helper, icon, tone = "blue" }) => (
  <article className={`${styles.card} ${styles[tone]}`}>
    <div className={styles.icon}>{icon}</div>
    <div>
      <p>{label}</p>
      <strong>{value}</strong>
      {helper && <span>{helper}</span>}
    </div>
  </article>
);

export default StatCard;
