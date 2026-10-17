// src/components/admin/AdminTopbar.jsx
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AdminTopbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <header className="flex items-center justify-between bg-white px-6 py-4 border-b border-gray-200">
      <div />
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">
          Xin chào, <strong className="text-gray-900">{user?.fullName}</strong>
        </span>
        <button
          onClick={handleLogout}
          className="text-sm font-medium text-red-600 hover:text-red-700"
        >
          Đăng xuất
        </button>
      </div>
    </header>
  );
}