// src/pages/admin/AdminLogin.jsx
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getErrorMessage } from "../../api/axiosClient";

export default function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const from = useLocation().state?.from?.pathname || "/admin/dashboard";

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const loggedInUser = await login(form.email, form.password);

      if (loggedInUser.role !== "Admin") {
        setError("Tài khoản này không có quyền truy cập trang quản trị.");
        setLoading(false);
        return;
      }

      navigate(from, { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.title}>Đăng nhập quản trị</h2>
        <p style={styles.subtitle}>BookStore Admin Panel</p>

        {error && <div style={styles.error}>{error}</div>}

        <label style={styles.label}>Email</label>
        <input
          type="email"
          name="email"
          required
          value={form.email}
          onChange={handleChange}
          style={styles.input}
          placeholder="admin@bookstore.local"
        />

        <label style={styles.label}>Mật khẩu</label>
        <input
          type="password"
          name="password"
          required
          value={form.password}
          onChange={handleChange}
          style={styles.input}
          placeholder="••••••••"
        />

        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? "Đang xử lý..." : "Đăng nhập"}
        </button>
      </form>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f3f4f6",
  },
  form: {
    width: 360,
    padding: 32,
    backgroundColor: "#fff",
    borderRadius: 8,
    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
  },
  title: {
    margin: 0,
    fontSize: 22,
    color: "#111827",
  },
  subtitle: {
    margin: "4px 0 24px",
    fontSize: 13,
    color: "#6b7280",
  },
  label: {
    display: "block",
    fontSize: 13,
    fontWeight: 600,
    marginBottom: 6,
    color: "#374151",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    marginBottom: 16,
    border: "1px solid #d1d5db",
    borderRadius: 6,
    fontSize: 14,
    boxSizing: "border-box",
  },
  button: {
    width: "100%",
    padding: "10px 12px",
    backgroundColor: "#111827",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
  },
  error: {
    backgroundColor: "#fee2e2",
    color: "#b91c1c",
    padding: "10px 12px",
    borderRadius: 6,
    fontSize: 13,
    marginBottom: 16,
  },
};