// src/components/admin/BookFormModal.jsx
import { useEffect, useState } from "react";
import { categoryApi } from "../../api/categoryApi";
import { authorApi } from "../../api/authorApi";
import { publisherApi } from "../../api/publisherApi";
import { getErrorMessage } from "../../api/axiosClient";

const emptyForm = {
  name: "",
  description: "",
  price: 0,
  stock: 0,
  imageUrls: [""],
  categoryId: "",
  bookDetail: { isbn: "", pages: "", language: "Tiếng Việt", publisherId: "", authorIds: [] },
};

export default function BookFormModal({ open, book, onClose, onSubmit }) {
  const [form, setForm] = useState(emptyForm);
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    categoryApi.getAll("Book").then((res) => setCategories(res.data));
    authorApi.getAll().then((res) => setAuthors(res.data));
    publisherApi.getAll().then((res) => setPublishers(res.data));

    if (book) {
      setForm({
        name: book.name,
        description: book.description || "",
        price: book.price,
        stock: book.stock,
        imageUrls: book.imageUrls?.length ? book.imageUrls : [""],
        categoryId: book.categoryId,
        bookDetail: {
          isbn: book.bookDetail?.isbn || "",
          pages: book.bookDetail?.pages || "",
          language: book.bookDetail?.language || "Tiếng Việt",
          publisherId: book.bookDetail?.publisher?.id || "",
          authorIds: book.bookDetail?.authors?.map((a) => a.id) || [],
        },
      });
    } else {
      setForm(emptyForm);
    }
    setError("");
  }, [open, book]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBookDetailChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, bookDetail: { ...prev.bookDetail, [name]: value } }));
  };

  const handleImageChange = (value) => {
    setForm((prev) => ({ ...prev, imageUrls: [value] }));
  };

  const toggleAuthor = (authorId) => {
    setForm((prev) => {
      const current = prev.bookDetail.authorIds;
      const next = current.includes(authorId)
        ? current.filter((id) => id !== authorId)
        : [...current, authorId];
      return { ...prev, bookDetail: { ...prev.bookDetail, authorIds: next } };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await onSubmit({
        ...form,
        imageUrls: form.imageUrls.filter(Boolean),
        price: Number(form.price),
        stock: Number(form.stock),
        categoryId: Number(form.categoryId),
        bookDetail: {
          ...form.bookDetail,
          pages: form.bookDetail.pages ? Number(form.bookDetail.pages) : null,
          publisherId: form.bookDetail.publisherId ? Number(form.bookDetail.publisherId) : null,
        },
      });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-slate-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white " +
    "px-3.5 py-2.5 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition";

  const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 py-6">
      <div className="w-full max-w-3xl max-h-[88vh] flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">

        {/* ===== Header sticky ===== */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-gray-700 shrink-0">
          <div className="flex items-center gap-3">
            <span className="grid place-items-center w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
              </svg>
            </span>
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                {book ? "Sửa sách" : "Thêm sách mới"}
              </h3>
              <p className="text-xs text-gray-400">Điền đầy đủ thông tin bên dưới</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="grid place-items-center w-8 h-8 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-600 transition"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ===== Nội dung cuộn riêng ===== */}
        <form id="book-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {error && (
            <div className="rounded-lg bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-[120px_1fr] gap-5">
            {/* Preview ảnh bìa */}
            <div>
              <label className={labelClass}>Ảnh bìa</label>
              <div className="w-[120px] h-[168px] rounded-lg border border-dashed border-slate-300 dark:border-gray-600
                              bg-slate-50 dark:bg-gray-900 overflow-hidden grid place-items-center">
                {form.imageUrls[0] ? (
                  <img src={form.imageUrls[0]} alt="preview" className="w-full h-full object-cover" />
                ) : (
                  <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor"
                    strokeWidth="1.5" className="text-slate-300">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path d="m21 15-5-5L5 21" />
                  </svg>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className={labelClass}>Tên sách</label>
                <input name="name" required value={form.name} onChange={handleChange} className={inputClass} placeholder="VD: Nhà giả kim" />
              </div>
              <div>
                <label className={labelClass}>URL ảnh bìa</label>
                <input
                  value={form.imageUrls[0] || ""}
                  onChange={(e) => handleImageChange(e.target.value)}
                  className={inputClass}
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>

          <div>
            <label className={labelClass}>Mô tả</label>
            <textarea name="description" rows={5} value={form.description} onChange={handleChange} className={inputClass} />
          </div>

          {/* ===== Nhóm: Giá & Tồn kho ===== */}
          <div className="rounded-xl border border-slate-100 dark:border-gray-700 p-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Giá & Tồn kho</p>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>Giá (đ)</label>
                <input type="number" name="price" required min="0" value={form.price} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Tồn kho</label>
                <input type="number" name="stock" required min="0" value={form.stock} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Danh mục</label>
                <select name="categoryId" required value={form.categoryId} onChange={handleChange} className={inputClass}>
                  <option value="">-- Chọn --</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* ===== Nhóm: Chi tiết sách ===== */}
          <div className="rounded-xl border border-slate-100 dark:border-gray-700 p-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Chi tiết sách</p>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <label className={labelClass}>ISBN</label>
                <input name="isbn" value={form.bookDetail.isbn} onChange={handleBookDetailChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Số trang</label>
                <input type="number" name="pages" value={form.bookDetail.pages} onChange={handleBookDetailChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Nhà xuất bản</label>
                <select name="publisherId" value={form.bookDetail.publisherId} onChange={handleBookDetailChange} className={inputClass}>
                  <option value="">-- Chọn --</option>
                  {publishers.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
            </div>

            <label className={labelClass}>Tác giả</label>
            <div className="flex flex-wrap gap-2">
              {authors.map((a) => {
                const selected = form.bookDetail.authorIds.includes(a.id);
                return (
                  <button
                    type="button"
                    key={a.id}
                    onClick={() => toggleAuthor(a.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition
                      ${selected
                        ? "bg-indigo-600 border-indigo-600 text-white"
                        : "border-slate-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-indigo-300 hover:text-indigo-600"}`}
                  >
                    {selected && (
                      <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                    )}
                    {a.name}
                  </button>
                );
              })}
            </div>
          </div>
        </form>

        {/* ===== Footer sticky ===== */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-100 dark:border-gray-700 shrink-0">
          <button
            type="button" onClick={onClose} disabled={loading}
            className="px-5 py-2.5 text-sm font-medium rounded-lg border border-slate-200 dark:border-gray-700
                       text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            Hủy
          </button>
          <button
            type="submit" form="book-form" disabled={loading}
            className="px-5 py-2.5 text-sm font-semibold rounded-lg bg-indigo-600 text-white
                       hover:bg-indigo-700 disabled:opacity-60 shadow-sm shadow-indigo-600/20 transition"
          >
            {loading ? "Đang lưu..." : book ? "Lưu thay đổi" : "Thêm sách"}
          </button>
        </div>
      </div>
    </div>
  );
}