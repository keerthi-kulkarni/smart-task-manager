import { CheckCircle2 } from "lucide-react";
import { Outlet } from "react-router-dom";
import styles from "./AuthLayout.module.css";

const AuthLayout = () => (
  <main className={styles.authShell}>
    <section className={styles.brandPanel}>
      <div className={styles.logoMark}>ST</div>
      <h1>Smart Task Manager</h1>
      <div className={styles.signalList}>
        <span>
          <CheckCircle2 size={18} /> Study
        </span>
        <span>
          <CheckCircle2 size={18} /> Work
        </span>
        <span>
          <CheckCircle2 size={18} /> Health
        </span>
      </div>
    </section>
    <section className={styles.formPanel}>
      <Outlet />
    </section>
  </main>
);

export default AuthLayout;
