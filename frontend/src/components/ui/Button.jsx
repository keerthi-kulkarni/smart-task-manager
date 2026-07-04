import styles from "./Button.module.css";

const Button = ({
  children,
  className = "",
  isLoading = false,
  size = "md",
  variant = "primary",
  type = "button",
  ...props
}) => (
  <button
    className={`${styles.button} ${styles[variant]} ${styles[size]} ${className}`}
    disabled={isLoading || props.disabled}
    type={type}
    {...props}
  >
    {isLoading ? <span className={styles.loader} /> : children}
  </button>
);

export default Button;
