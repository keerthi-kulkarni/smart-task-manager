import { Link } from "react-router-dom";
import styles from "./NotFound.module.css";

const NotFound = () => (
  <main className={styles.page}>
    <h1>404</h1>
    <p>Page not found.</p>
    <Link className={styles.linkButton} to="/">
      Back to Dashboard
    </Link>
  </main>
);

export default NotFound;
