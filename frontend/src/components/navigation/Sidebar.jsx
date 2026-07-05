import { Bell, BarChart3, CheckSquare, UserRound } from "lucide-react";
import { NavLink } from "react-router-dom";
import styles from "./Sidebar.module.css";

const navItems = [
  { to: "/", label: "Dashboard", icon: BarChart3 },
  { to: "/tasks", label: "Tasks", icon: CheckSquare },
  { to: "/notifications", label: "Notifications", icon: Bell },
  { to: "/profile", label: "Profile", icon: UserRound }
];

const Sidebar = () => (
  <aside className={styles.sidebar}>
    <div className={styles.brand}>
      <span className={styles.brandMark}>ST</span>
      <span>Smart Tasks</span>
    </div>
    <nav className={styles.nav}>
      {navItems.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === "/"}
          className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ""}`}
        >
          <Icon size={19} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  </aside>
);

export default Sidebar;
