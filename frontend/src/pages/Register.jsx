import { useState } from "react";
import toast from "react-hot-toast";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { getErrorMessage } from "../services/api.js";
import Button from "../components/ui/Button.jsx";
import Input from "../components/ui/Input.jsx";
import styles from "./Auth.module.css";

const Register = () => {
  const { register, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await register(form);
      toast.success("Account created");
      navigate("/", { replace: true });
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className={styles.card} onSubmit={handleSubmit}>
      <div className={styles.header}>
        <p>Create account</p>
        <h2>Start your workspace</h2>
      </div>
      <Input
        label="Name"
        autoComplete="name"
        required
        placeholder="Your name"
        value={form.name}
        onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
      />
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
        autoComplete="new-password"
        required
        minLength={6}
        placeholder="At least 6 characters"
        value={form.password}
        onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
      />
      <Button type="submit" isLoading={isSubmitting}>
        Register
      </Button>
      <p className={styles.footerText}>
        Already registered? <Link to="/login">Login</Link>
      </p>
    </form>
  );
};

export default Register;
