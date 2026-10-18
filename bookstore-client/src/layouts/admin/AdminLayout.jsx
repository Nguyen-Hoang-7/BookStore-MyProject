import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminHeader from "../../components/admin/AdminHeader";

function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setCollapsed((previous) => !previous);
  };

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen((previous) => !previous);
  };

  const closeMobileSidebar = () => {
    setMobileSidebarOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/admin/login", { replace: true });
    } catch (error) {
      console.error("Đăng xuất thất bại:", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
      {/* Sidebar */}
      <AdminSidebar
        collapsed={collapsed}
        mobileOpen={mobileSidebarOpen}
        onNavigate={closeMobileSidebar}
      />

      {/* Overlay trên mobile */}
      {mobileSidebarOpen && (
        <button
          type="button"
          aria-label="Đóng menu quản trị"
          onClick={closeMobileSidebar}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs md:hidden dark:bg-slate-950/70"
        />
      )}

      {/* Header */}
      <AdminHeader
        collapsed={collapsed}
        onToggleSidebar={toggleSidebar}
        onToggleMobileSidebar={toggleMobileSidebar}
        userName={user?.fullName || "Administrator"}
        userRole="Quản trị viên"
        onLogout={handleLogout}
      />

      {/* Nội dung trang con */}
      <main
        className={`
          min-h-[calc(100vh-76px)]
          p-4 transition-[margin] duration-300
          sm:p-5 md:p-6 lg:p-8
          ${collapsed ? "md:ml-20" : "md:ml-64"}
        `}
      >
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;