// src/pages/admin/AdminBooks.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { bookApi } from "../../api/bookApi";
import { getErrorMessage } from "../../api/axiosClient";
import BookTable from "../../components/admin/BookTable";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import Pagination from "../../components/common/Pagination";

export default function AdminBooks() {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const [deletingBook, setDeletingBook] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const pageSize = 10;
  const totalPages = Math.ceil(total / pageSize);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const res = await bookApi.getAll({ q: search, page, pageSize });
      setBooks(res.data.items);
      setTotal(res.data.total);
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchBooks();
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await bookApi.remove(deletingBook.id);
      setDeletingBook(null);
      fetchBooks();
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Quản lý sách</h2>
        <button
          onClick={() => navigate("/admin/books/new")}
          className="px-4 py-2 text-sm font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
        >
          + Thêm sách
        </button>
      </div>

      <form onSubmit={handleSearchSubmit} className="mb-4">
        <input
          type="text"
          placeholder="Tìm theo tên sách..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm rounded-lg border border-slate-200 dark:border-gray-700
                     dark:bg-gray-900 dark:text-white px-4 py-2 text-sm
                     focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </form>

      {loading ? (
        <p className="text-sm text-gray-400 text-center py-10">Đang tải...</p>
      ) : (
        <>
          <BookTable
            books={books}
            onEdit={(book) => navigate(`/admin/books/${book.id}/edit`)}
            onDelete={setDeletingBook}
          />
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </>
      )}

      <ConfirmDialog
        open={!!deletingBook}
        title="Xóa sách"
        message={`Bạn có chắc muốn xóa "${deletingBook?.name}"? Hành động này không thể hoàn tác.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeletingBook(null)}
        loading={deleting}
      />
    </div>
  );
}