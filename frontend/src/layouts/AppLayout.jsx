import { Outlet } from "react-router-dom";
import Sidebar from "../components/navigation/Sidebar.jsx";
import Topbar from "../components/navigation/Topbar.jsx";
import styles from "./AppLayout.module.css";

const AppLayout = () => (
  <div className={styles.shell}>
    <Sidebar />
    <main className={styles.main}>
      <Topbar />
      <div className={styles.content}>
        <Outlet />
      </div>
    </main>
  </div>
);

export default AppLayout;
