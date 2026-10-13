// src/pages/admin/AdminLayout.jsx
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <aside style={{ width: 220, backgroundColor: "#111827", color: "#fff", padding: 16 }}>
        <h3 style={{ marginTop: 0 }}>BookStore Admin</h3>
        <nav style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 24 }}>
          <Link to="/admin/dashboard" style={{ color: "#fff" }}>Dashboard</Link>
          <Link to="/admin/categories" style={{ color: "#fff" }}>Danh mục</Link>
          <Link to="/admin/products" style={{ color: "#fff" }}>Sản phẩm</Link>
          <Link to="/admin/users" style={{ color: "#fff" }}>Người dùng</Link>
        </nav>
      </aside>

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <header style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "12px 24px", borderBottom: "1px solid #e5e7eb"
        }}>
          <span>Xin chào, <strong>{user?.fullName}</strong></span>
          <button onClick={handleLogout}>Đăng xuất</button>
        </header>

        <main style={{ padding: 24 }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}