import { useState } from "react";
import toast from "react-hot-toast";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { getErrorMessage } from "../services/api.js";
import Button from "../components/ui/Button.jsx";
import Input from "../components/ui/Input.jsx";
import styles from "./Auth.module.css";

const Login = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await login(form);
      toast.success("Welcome back");
      navigate(location.state?.from?.pathname || "/", { replace: true });
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className={styles.card} onSubmit={handleSubmit}>
      <div className={styles.header}>
        <p>Sign in</p>
        <h2>Welcome back</h2>
      </div>
      <Input
        label="Email"
        type="email"
        autoComplete="email"
        required
        placeholder="you@example.com"
        value={form.email}
        onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
      />
      <Input
        label="Password"
        type="password"
        autoComplete="current-password"
        required
        placeholder="Enter password"
        value={form.password}
        onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
      />
      <p style={{ textAlign: "right", marginBottom: "16px" }}>
  <Link to="/forgot-password">Forgot Password?</Link>
</p>

<Button type="submit" isLoading={isSubmitting}>
  Login
</Button>

<p className={styles.footerText}>
  New here? <Link to="/register">Create an account</Link>
</p>
    </form>
  );
};

export default Login;
