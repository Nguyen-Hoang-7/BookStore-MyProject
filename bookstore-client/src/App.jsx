
import { Routes, Route, Navigate } from "react-router-dom";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./layouts/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminBooks from "./pages/admin/AdminBooks";
import AdminRoute from "./components/AdminRoute";
import BookFormPage from "./pages/admin/BookFormPage";

function App() {
  return (
    <Routes>
      {/* Trang đăng nhập Admin - không sử dụng AdminLayout */}
      {/* Khu vực Admin */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="books" element={<AdminBooks />} />
        <Route path="books/new" element={<BookFormPage />} />
        <Route path="books/:id/edit" element={<BookFormPage />} />
        {/* Các route con khác (categories, products, users) thêm sau */}
      </Route>
    </Routes>
  );
}

export default App;
