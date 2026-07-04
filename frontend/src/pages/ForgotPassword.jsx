import { useState } from "react";
import Button from "../components/ui/Button.jsx";
import Input from "../components/ui/Input.jsx";
import styles from "./Auth.module.css";
import api, { getErrorMessage } from "../services/api.js";
import toast from "react-hot-toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

const [isSubmitting, setIsSubmitting] = useState(false);

const handleSubmit = async (e) => {
  e.preventDefault();

  setIsSubmitting(true);

  try {
    const { data } = await api.post("/auth/forgot-password", {
      email
    });

    toast.success(data.message);

    setEmail("");
  } catch (error) {
    toast.error(getErrorMessage(error));
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <form className={styles.card} onSubmit={handleSubmit}>
      <div className={styles.header}>
        <p>Forgot Password</p>
        <h2>Reset your password</h2>
      </div>

      <Input
        label="Email"
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <Button
  type="submit"
  isLoading={isSubmitting}
>
  Send Reset Link
</Button>
    </form>
  );
};

export default ForgotPassword;