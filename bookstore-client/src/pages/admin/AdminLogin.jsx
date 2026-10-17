
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getErrorMessage } from "../../api/axiosClient";
import "./AdminLogin.css";

export default function AdminLogin() {
  const { login, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from =
    location.state?.from?.pathname || "/admin/dashboard";

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const loggedInUser = await login(
        form.email.trim(),
        form.password
      );

      // Chỉ tài khoản Admin được vào trang quản trị.
      if (loggedInUser?.role !== "Admin") {
        // Xóa phiên đăng nhập nếu tài khoản không phải Admin.
        logout();

        setError(
          "Tài khoản này không có quyền truy cập trang quản trị."
        );
        return;
      }

      navigate(from, { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="admin-login-page">
      {/* Bên trái: Form đăng nhập */}
      <section className="admin-login-left">
        <div className="admin-login-content">
          <a
            href="/admin/login"
            className="admin-brand"
            aria-label="BookStore Admin"
          >
            <span className="admin-brand-icon">
              <svg
                viewBox="0 0 24 24"
                width="27"
                height="27"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
                <path d="M8 7h8M8 11h6" />
              </svg>
            </span>

            <span className="admin-brand-text">
              <strong>BookStore</strong>
              <small>ADMIN CONSOLE</small>
            </span>
          </a>

          <div className="admin-login-heading">
            <span className="admin-eyebrow">
              ADMINISTRATION
            </span>

            <h1>Chào mừng trở lại</h1>

            <p>
              Đăng nhập để tiếp tục quản lý cửa hàng sách
              của bạn.
            </p>
          </div>

          {error && (
            <div className="admin-login-error" role="alert">
              <span aria-hidden="true">!</span>
              <p>{error}</p>
            </div>
          )}

          <form
            className="admin-login-form"
            onSubmit={handleSubmit}
          >
            <div className="admin-form-group">
              <label htmlFor="admin-email">
                Email quản trị
              </label>

              <div className="admin-input-wrap">
                <svg
                  viewBox="0 0 24 24"
                  width="19"
                  height="19"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  aria-hidden="true"
                >
                  <rect
                    x="3"
                    y="5"
                    width="18"
                    height="14"
                    rx="2"
                  />
                  <path d="m3 7 9 6 9-6" />
                </svg>

                <input
                  id="admin-email"
                  name="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="username"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label htmlFor="admin-password">
                Mật khẩu
              </label>

              <div className="admin-input-wrap">
                <svg
                  viewBox="0 0 24 24"
                  width="19"
                  height="19"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  aria-hidden="true"
                >
                  <rect
                    x="4"
                    y="10"
                    width="16"
                    height="11"
                    rx="2"
                  />
                  <path d="M8 10V7a4 4 0 1 1 8 0v3" />
                </svg>

                <input
                  id="admin-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Nhập mật khẩu của bạn"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  required
                  disabled={loading}
                />

                <button
                  type="button"
                  className="admin-password-toggle"
                  onClick={() =>
                    setShowPassword((prev) => !prev)
                  }
                  aria-label={
                    showPassword
                      ? "Ẩn mật khẩu"
                      : "Hiện mật khẩu"
                  }
                  aria-pressed={showPassword}
                >
                  {showPassword ? "Ẩn" : "Hiện"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="admin-login-submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="admin-spinner" />
                  Đang xác thực...
                </>
              ) : (
                <>
                  Đăng nhập quản trị
                  <span aria-hidden="true">→</span>
                </>
              )}
            </button>
          </form>

          <div className="admin-login-security">
            <svg
              viewBox="0 0 24 24"
              width="17"
              height="17"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              aria-hidden="true"
            >
              <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" />
              <path d="m9 12 2 2 4-4" />
            </svg>

            Khu vực dành riêng cho quản trị viên.
          </div>
        </div>

        <footer className="admin-login-footer">
          © {new Date().getFullYear()} BookStore.
          All rights reserved.
        </footer>
      </section>

      {/* Bên phải: Khu vực thương hiệu */}
      <aside className="admin-login-right">
        <div className="admin-decoration admin-decoration-one" />
        <div className="admin-decoration admin-decoration-two" />

        <div className="admin-showcase">
          <span className="admin-showcase-badge">
            <span className="admin-status-dot" />
            BOOKSTORE MANAGEMENT
          </span>

          <h2>
            Quản lý cửa hàng sách
            <br />
            <span>theo cách của bạn.</span>
          </h2>

          <p className="admin-showcase-description">
            Quản lý sách, thể loại và đơn hàng
            từ một không gian làm việc thống nhất.
          </p>

          <div className="admin-preview">
            <div className="admin-preview-header">
              <div className="admin-preview-dots">
                <i />
                <i />
                <i />
              </div>

              <span>BOOKSTORE / OVERVIEW</span>
            </div>

            <div className="admin-preview-body">
              <div className="admin-preview-title">
                Tổng quan quản trị
              </div>

              <div className="admin-preview-cards">
                <div className="admin-preview-card">
                  <span>01</span>
                  <div className="preview-icon preview-icon-purple">
                    B
                  </div>
                  <strong>Sách</strong>
                  <small>Quản lý kho sách</small>
                </div>

                <div className="admin-preview-card">
                  <span>02</span>
                  <div className="preview-icon preview-icon-blue">
                    O
                  </div>
                  <strong>Đơn hàng</strong>
                  <small>Theo dõi đơn hàng</small>
                </div>

                <div className="admin-preview-card">
                  <span>03</span>
                  <div className="preview-icon preview-icon-orange">
                    C
                  </div>
                  <strong>Thể loại</strong>
                  <small>Sắp xếp danh mục</small>
                </div>
              </div>

              <div className="admin-preview-bottom">
                <div className="preview-line-group">
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                </div>

                <div className="preview-bottom-info">
                  <strong>Một hệ thống. Mọi đầu việc.</strong>
                  <span>BookStore Admin Dashboard</span>
                </div>
              </div>
            </div>
          </div>

          <div className="admin-showcase-foot">
            <span>DESIGNED FOR BOOKSTORE</span>
            <span>BUILT FOR SIMPLICITY</span>
          </div>
        </div>
      </aside>
    </main>
  );
}
