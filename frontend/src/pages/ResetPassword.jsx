import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Button from "../components/ui/Button.jsx";
import Input from "../components/ui/Input.jsx";
import styles from "./Auth.module.css";
import api, { getErrorMessage } from "../services/api.js";

const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).+$/;

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [show, setShow] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return false;
    }
    if (!passwordRegex.test(password)) {
      toast.error("Password must include an uppercase letter, a number and a special character.");
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await api.post(`/auth/reset-password/${token}`, { password, confirmPassword });
      toast.success("Password reset successful. Redirecting to login...");
      navigate("/login", { replace: true });
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className={styles.card} onSubmit={handleSubmit}>
      <div className={styles.header}>
        <p>Reset Password</p>
        <h2>Create a new password</h2>
      </div>

      <Input
        label="New Password"
        type={show ? "text" : "password"}
        placeholder="Enter new password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <Input
        label="Confirm Password"
        type={show ? "text" : "password"}
        placeholder="Confirm new password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />

      <p style={{ textAlign: "right", marginBottom: "12px" }}>
        <label style={{ cursor: "pointer" }}>
          <input type="checkbox" checked={show} onChange={() => setShow((s) => !s)} /> Show password
        </label>
      </p>

      <Button type="submit" isLoading={isSubmitting}>
        Reset Password
      </Button>
    </form>
  );
};

export default ResetPassword;
