import styles from "./FormControls.module.css";

const Select = ({ label, options = [], placeholder, error, className = "", ...props }) => (
  <label className={`${styles.field} ${className}`}>
    {label && <span>{label}</span>}
    <select className={styles.control} {...props}>
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((option) => {
        const value = typeof option === "string" ? option : option.value;
        const optionLabel = typeof option === "string" ? option : option.label;

        return (
          <option key={value} value={value}>
            {optionLabel}
          </option>
        );
      })}
    </select>
    {error && <small className={styles.error}>{error}</small>}
  </label>
);

export default Select;
