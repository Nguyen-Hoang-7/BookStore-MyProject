// src/pages/admin/AdminLogin.jsx
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getErrorMessage } from "../../api/axiosClient";

export default function AdminLogin() {
  const { login, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/admin/dashboard";

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const loggedInUser = await login(form.email.trim(), form.password);

      if (loggedInUser?.role !== "Admin") {
        logout();
        setError("Tài khoản này không có quyền truy cập trang quản trị.");
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
    <main className="grid grid-cols-1 lg:grid-cols-2 min-h-screen bg-white text-gray-900">
      {/* ================= Bên trái: Form đăng nhập ================= */}
      <section className="relative flex flex-col justify-between min-w-0 px-6 lg:px-16 py-9 overflow-hidden">
        {/* Quầng sáng góc trên trái, mô phỏng radial-gradient gốc */}
        <div className="pointer-events-none absolute -top-20 -left-20 w-80 h-80 rounded-full bg-indigo-500/5 blur-3xl" />

        <div className="relative w-full max-w-md mx-auto py-11">
          {/* Logo + thương hiệu */}
          <a href="/admin/login" className="inline-flex items-center gap-3 mb-14 text-inherit no-underline">
            <span className="grid place-items-center w-12 h-12 shrink-0 rounded-2xl bg-indigo-50 text-indigo-600">
              <svg viewBox="0 0 24 24" width="27" height="27" fill="none" stroke="currentColor"
                strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
                <path d="M8 7h8M8 11h6" />
              </svg>
            </span>
            <span className="flex flex-col gap-0.5">
              <strong className="text-xl font-bold tracking-tight">BookStore</strong>
              <small className="text-indigo-400 text-[10px] font-bold tracking-[2px]">ADMIN CONSOLE</small>
            </span>
          </a>

          {/* Tiêu đề */}
          <div className="mb-8">
            <span className="inline-block mb-3 text-indigo-600 text-[11px] font-extrabold tracking-[1.8px]">
              ADMINISTRATION
            </span>
            <h1 className="mb-3 text-gray-900 text-3xl lg:text-[38px] font-bold leading-tight tracking-tight">
              Chào mừng trở lại
            </h1>
            <p className="text-slate-500 text-sm leading-[1.8]">
              Đăng nhập để tiếp tục quản lý cửa hàng sách của bạn.
            </p>
          </div>

          {/* Thông báo lỗi */}
          {error && (
            <div role="alert" className="flex items-start gap-2.5 mb-5 px-3.5 py-3 rounded-[10px]
                                          border border-red-200 bg-red-50 text-red-700 text-[13px] leading-[1.6]">
              <span className="grid place-items-center shrink-0 w-5 h-5 rounded-full border border-current font-bold">!</span>
              <p className="m-0">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-[23px]">
            <div className="flex flex-col gap-[9px]">
              <label htmlFor="admin-email" className="text-slate-700 text-[13px] font-semibold">
                Email quản trị
              </label>
              <div className="flex items-center gap-[11px] min-h-[53px] px-[15px] rounded-[11px]
                              border border-slate-200 bg-white text-slate-400 transition
                              focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-500/10">
                <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor"
                  strokeWidth="1.7" className="shrink-0" aria-hidden="true">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
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
                  className="w-full h-[50px] bg-transparent outline-none border-0 text-gray-900 text-sm
                             placeholder:text-slate-400 disabled:opacity-70 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <div className="flex flex-col gap-[9px]">
              <label htmlFor="admin-password" className="text-slate-700 text-[13px] font-semibold">
                Mật khẩu
              </label>
              <div className="flex items-center gap-[11px] min-h-[53px] px-[15px] rounded-[11px]
                              border border-slate-200 bg-white text-slate-400 transition
                              focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-500/10">
                <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor"
                  strokeWidth="1.7" className="shrink-0" aria-hidden="true">
                  <rect x="4" y="10" width="16" height="11" rx="2" />
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
                  className="w-full h-[50px] bg-transparent outline-none border-0 text-gray-900 text-sm
                             placeholder:text-slate-400 disabled:opacity-70 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  aria-pressed={showPassword}
                  className="shrink-0 py-[5px] pl-[5px] text-slate-500 text-xs font-semibold
                             hover:text-indigo-600 bg-transparent border-0 cursor-pointer"
                >
                  {showPassword ? "Ẩn" : "Hiện"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group flex items-center justify-center gap-3 min-h-[53px] mt-1 rounded-[11px]
                         bg-gradient-to-r from-indigo-600 to-indigo-500 text-white text-sm font-bold
                         shadow-[0_8px_18px_rgba(79,70,229,0.20)] transition
                         hover:from-indigo-700 hover:to-indigo-600 hover:-translate-y-px
                         hover:shadow-[0_11px_22px_rgba(79,70,229,0.27)]
                         disabled:opacity-75 disabled:cursor-wait"
            >
              {loading ? (
                <>
                  <span className="w-[17px] h-[17px] border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Đang xác thực...
                </>
              ) : (
                <>
                  Đăng nhập quản trị
                  <span className="text-lg leading-none transition-transform group-hover:translate-x-1">→</span>
                </>
              )}
            </button>
          </form>

          {/* Ghi chú bảo mật */}
          <div className="flex items-center justify-center gap-2 mt-[25px] text-slate-500 text-xs leading-[1.7]">
            <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor"
              strokeWidth="1.7" className="shrink-0" aria-hidden="true">
              <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
            Khu vực dành riêng cho quản trị viên.
          </div>
        </div>

        <footer className="pt-5 text-slate-400 text-[11px] text-center">
          © {new Date().getFullYear()} BookStore. All rights reserved.
        </footer>
      </section>

      {/* ================= Bên phải: Khu vực thương hiệu ================= */}
      <aside className="hidden lg:flex relative items-center justify-center min-w-0 overflow-hidden p-10 lg:p-16
                         bg-gradient-to-br from-indigo-900 via-indigo-800 to-blue-900 text-white">
        {/* Vòng tròn trang trí */}
        <div className="pointer-events-none absolute -top-[150px] -right-[120px] w-[430px] h-[430px]
                        rounded-full border border-white/10" />
        <div className="pointer-events-none absolute -right-16 -bottom-60 w-[540px] h-[540px]
                        rounded-full border border-white/10" />

        <div className="relative z-10 w-full max-w-[590px] mx-auto">
          {/* Badge trạng thái */}
          <span className="inline-flex items-center gap-2.5 px-[13px] py-2.5 rounded-full
                           border border-white/15 bg-white/[0.07] text-indigo-100 text-[10px]
                           font-extrabold tracking-[1.2px]">
            <span className="w-[7px] h-[7px] rounded-full bg-green-300 shadow-[0_0_12px_rgba(134,239,172,0.55)]" />
            BOOKSTORE MANAGEMENT
          </span>

          <h2 className="mt-7 mb-4 text-3xl lg:text-[43px] font-bold leading-[1.25] tracking-tight">
            Quản lý cửa hàng sách
            <br />
            <span className="text-indigo-200">theo cách của bạn.</span>
          </h2>

          <p className="max-w-[390px] text-indigo-200 text-sm leading-[1.9]">
            Quản lý sách, thể loại và đơn hàng từ một không gian làm việc thống nhất.
          </p>

          {/* Khung xem trước dashboard */}
          <div className="mt-9 rounded-2xl border border-white/25 bg-white/[0.97] text-slate-800
                          shadow-[0_25px_65px_rgba(15,23,42,0.24)] overflow-hidden
                          -rotate-1 transition-transform duration-300 hover:rotate-0">
            <div className="flex items-center gap-3 min-h-[43px] px-[15px] border-b border-slate-200 bg-slate-50">
              <div className="flex gap-1">
                <i className="w-1.5 h-1.5 rounded-full bg-slate-300 not-italic" />
                <i className="w-1.5 h-1.5 rounded-full bg-slate-300 not-italic" />
                <i className="w-1.5 h-1.5 rounded-full bg-slate-300 not-italic" />
              </div>
              <span className="text-slate-500 text-[8px] font-extrabold tracking-wide">
                BOOKSTORE / OVERVIEW
              </span>
            </div>

            <div className="p-[19px]">
              <div className="mb-4 text-sm font-extrabold">Tổng quan quản trị</div>

              <div className="grid grid-cols-3 gap-2.5">
                <div className="relative flex flex-col gap-[7px] p-[11px_9px] rounded-[10px] border border-slate-100 bg-white">
                  <span className="text-slate-400 text-[9px] font-extrabold">01</span>
                  <div className="grid place-items-center w-[30px] h-[30px] rounded-[9px] bg-violet-100 text-violet-700 text-[13px] font-extrabold">B</div>
                  <strong className="text-slate-800 text-[11px] break-words">Sách</strong>
                  <small className="text-slate-400 text-[9px] leading-[1.4]">Quản lý kho sách</small>
                </div>

                <div className="relative flex flex-col gap-[7px] p-[11px_9px] rounded-[10px] border border-slate-100 bg-white">
                  <span className="text-slate-400 text-[9px] font-extrabold">02</span>
                  <div className="grid place-items-center w-[30px] h-[30px] rounded-[9px] bg-blue-100 text-blue-700 text-[13px] font-extrabold">O</div>
                  <strong className="text-slate-800 text-[11px] break-words">Đơn hàng</strong>
                  <small className="text-slate-400 text-[9px] leading-[1.4]">Theo dõi đơn hàng</small>
                </div>

                <div className="relative flex flex-col gap-[7px] p-[11px_9px] rounded-[10px] border border-slate-100 bg-white">
                  <span className="text-slate-400 text-[9px] font-extrabold">03</span>
                  <div className="grid place-items-center w-[30px] h-[30px] rounded-[9px] bg-orange-100 text-orange-700 text-[13px] font-extrabold">C</div>
                  <strong className="text-slate-800 text-[11px] break-words">Thể loại</strong>
                  <small className="text-slate-400 text-[9px] leading-[1.4]">Sắp xếp danh mục</small>
                </div>
              </div>

              <div className="flex items-end justify-between gap-3.5 mt-3.5 p-[15px] rounded-[10px]
                              border border-slate-100 bg-gradient-to-b from-indigo-50/25 to-indigo-50/80">
                <div className="flex items-end gap-[5px] h-12">
                  <span className="block w-[11px] rounded-t bg-gradient-to-b from-indigo-400 to-indigo-600" style={{ height: "35%" }} />
                  <span className="block w-[11px] rounded-t bg-gradient-to-b from-indigo-400 to-indigo-600" style={{ height: "55%" }} />
                  <span className="block w-[11px] rounded-t bg-gradient-to-b from-indigo-400 to-indigo-600" style={{ height: "43%" }} />
                  <span className="block w-[11px] rounded-t bg-gradient-to-b from-indigo-400 to-indigo-600" style={{ height: "80%" }} />
                  <span className="block w-[11px] rounded-t bg-gradient-to-b from-indigo-400 to-indigo-600" style={{ height: "63%" }} />
                  <span className="block w-[11px] rounded-t bg-gradient-to-b from-indigo-400 to-indigo-600" style={{ height: "100%" }} />
                  <span className="block w-[11px] rounded-t bg-gradient-to-b from-indigo-400 to-indigo-600" style={{ height: "72%" }} />
                </div>
                <div className="flex flex-col gap-[5px] text-right">
                  <strong className="text-slate-600 text-[10px]">Một hệ thống. Mọi đầu việc.</strong>
                  <span className="text-slate-400 text-[9px]">BookStore Admin Dashboard</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between gap-3 mt-[26px] text-indigo-200 text-[9px] font-bold tracking-wide">
            <span>DESIGNED FOR BOOKSTORE</span>
            <span>BUILT FOR SIMPLICITY</span>
          </div>
        </div>
      </aside>
    </main>
  );
}