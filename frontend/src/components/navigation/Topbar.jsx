import { LogOut, Moon, Sun } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext.jsx";
import { useTheme } from "../../context/ThemeContext.jsx";
import Button from "../ui/Button.jsx";
import styles from "./Topbar.module.css";

const Topbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = async () => {
    await logout();
    toast.success("Signed out");
  };

  return (
    <header className={styles.topbar}>
      <div>
        <p className={styles.eyebrow}>Workspace</p>
        <h2>{user?.name || "Student"}</h2>
      </div>
      <div className={styles.actions}>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </Button>
        <Button type="button" variant="secondary" onClick={handleLogout}>
          <LogOut size={17} />
          Logout
        </Button>
      </div>
    </header>
  );
};

export default Topbar;
