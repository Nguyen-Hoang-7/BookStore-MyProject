// src/pages/admin/BookFormPage.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { bookApi } from "../../api/bookApi";
import { categoryApi } from "../../api/categoryApi";
import { authorApi } from "../../api/authorApi";
import { publisherApi } from "../../api/publisherApi";
import { uploadApi } from "../../api/uploadApi";
import { getErrorMessage } from "../../api/axiosClient";

const FILE_BASE_URL = import.meta.env.VITE_FILE_BASE_URL;
const MAX_IMAGES = 10;

const emptyForm = {
  name: "",
  description: "",
  price: "",
  stock: "",
  imageUrls: [],
  categoryId: "",
  bookDetail: { isbn: "", pages: "", language: "Tiếng Việt", publisherId: "", authorIds: [] },
};

export default function BookFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [initializing, setInitializing] = useState(isEdit);

  useEffect(() => {
    categoryApi.getAll("Book").then((res) => setCategories(res.data));
    authorApi.getAll().then((res) => setAuthors(res.data));
    publisherApi.getAll().then((res) => setPublishers(res.data));

    if (isEdit) {
      bookApi.getById(id).then((res) => {
        const book = res.data;
        setForm({
          name: book.name,
          description: book.description || "",
          price: book.price,
          stock: book.stock,
          imageUrls: book.imageUrls || [],
          categoryId: book.categoryId,
          bookDetail: {
            isbn: book.bookDetail?.isbn || "",
            pages: book.bookDetail?.pages || "",
            language: book.bookDetail?.language || "Tiếng Việt",
            publisherId: book.bookDetail?.publisher?.id || "",
            authorIds: book.bookDetail?.authors?.map((a) => a.id) || [],
          },
        });
        setInitializing(false);
      });
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBookDetailChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, bookDetail: { ...prev.bookDetail, [name]: value } }));
  };

  // ===== Xử lý nhiều ảnh =====
  const handleFilesSelect = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const remainingSlots = MAX_IMAGES - form.imageUrls.length;
    if (remainingSlots <= 0) {
      setError(`Chỉ được tối đa ${MAX_IMAGES} ảnh.`);
      e.target.value = "";
      return;
    }

    const filesToUpload = files.slice(0, remainingSlots);

    setError("");
    setUploading(true);

    try {
      const res = await uploadApi.uploadImages(filesToUpload);
      const newUrls = res.data.uploaded.map((item) => item.url);

      setForm((prev) => ({
        ...prev,
        imageUrls: [...prev.imageUrls, ...newUrls],
      }));

      if (res.data.errors.length > 0) {
        setError(res.data.errors.join(" — "));
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleRemoveImage = (index) => {
    setForm((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index),
    }));
  };

  const handleSetCover = (index) => {
    setForm((prev) => {
      const urls = [...prev.imageUrls];
      const [selected] = urls.splice(index, 1);
      return { ...prev, imageUrls: [selected, ...urls] };
    });
  };

  const getImageSrc = (url) =>
    url.startsWith("http") ? url : `${FILE_BASE_URL}${url}`;

  const toggleAuthor = (authorId) => {
    setForm((prev) => {
      const current = prev.bookDetail.authorIds;
      const next = current.includes(authorId)
        ? current.filter((aid) => aid !== authorId)
        : [...current, authorId];
      return { ...prev, bookDetail: { ...prev.bookDetail, authorIds: next } };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      categoryId: Number(form.categoryId),
      bookDetail: {
        ...form.bookDetail,
        pages: form.bookDetail.pages ? Number(form.bookDetail.pages) : null,
        publisherId: form.bookDetail.publisherId ? Number(form.bookDetail.publisherId) : null,
      },
    };

    try {
      if (isEdit) {
        await bookApi.update(id, payload);
      } else {
        await bookApi.create(payload);
      }
      navigate("/admin/books");
    } catch (err) {
      setError(getErrorMessage(err));
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-slate-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white " +
    "px-3.5 py-2.5 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition";

  const labelClass = "block text-left text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5";

  const cardClass = "bg-white dark:bg-gray-800 rounded-2xl border border-slate-200 dark:border-gray-700 p-6";

  if (initializing) {
    return <p className="text-sm text-gray-400 text-center py-20">Đang tải dữ liệu...</p>;
  }

  return (
    <div>
      {/* ===== Breadcrumb + Tiêu đề ===== */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {isEdit ? "Sửa sách" : "Thêm sách mới"}
          </h2>
          <div className="flex items-center gap-1.5 text-sm text-gray-400 mt-1">
            <Link to="/admin/dashboard" className="hover:text-indigo-600">Quản trị</Link>
            <span>›</span>
            <Link to="/admin/books" className="hover:text-indigo-600">Sách</Link>
            <span>›</span>
            <span className="text-gray-600 dark:text-gray-300">{isEdit ? "Sửa" : "Thêm mới"}</span>
          </div>
        </div>

        <Link
          to="/admin/books"
          className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-200 dark:border-gray-700
                     text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
        >
          ← Quay lại danh sách
        </Link>
      </div>

      {error && (
        <div className="mb-5 rounded-lg bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ===== Cột trái: thông tin chính ===== */}
        <div className="lg:col-span-2 space-y-6">

          <div className={cardClass}>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Thông tin cơ bản</h3>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Tên sách</label>
                <input name="name" required value={form.name} onChange={handleChange} className={inputClass} placeholder="VD: Nhà giả kim" />
              </div>
              <div>
                <label className={labelClass}>Mô tả</label>
                <textarea name="description" rows={5} value={form.description} onChange={handleChange} className={inputClass} />
              </div>
            </div>
          </div>

          <div className={cardClass}>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Chi tiết sách</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div>
                <label className={labelClass}>ISBN</label>
                <input name="isbn" value={form.bookDetail.isbn} onChange={handleBookDetailChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Số trang</label>
                <input type="number" name="pages" value={form.bookDetail.pages} onChange={handleBookDetailChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Ngôn ngữ</label>
                <input name="language" value={form.bookDetail.language} onChange={handleBookDetailChange} className={inputClass} />
              </div>
            </div>

            <div>
              <label className={labelClass}>Nhà xuất bản</label>
              <select name="publisherId" value={form.bookDetail.publisherId} onChange={handleBookDetailChange} className={`${inputClass} mb-4`}>
                <option value="">-- Chọn nhà xuất bản --</option>
                {publishers.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
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
        </div>

        {/* ===== Cột phải: ảnh, giá, danh mục ===== */}
        <div className="space-y-6">

          {/* ===== Ảnh bìa (nhiều ảnh) ===== */}
          <div className={cardClass}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">Ảnh bìa</h3>
              <span className="text-xs text-gray-400">{form.imageUrls.length}/{MAX_IMAGES}</span>
            </div>

            {form.imageUrls.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mb-4">
                {form.imageUrls.map((url, index) => (
                  <div key={url} className="relative group aspect-[3/4] rounded-lg overflow-hidden border
                                              border-slate-200 dark:border-gray-700">
                    <img src={getImageSrc(url)} alt={`cover-${index}`} className="w-full h-full object-cover" />

                    {index === 0 && (
                      <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-indigo-600 text-white text-[10px] font-semibold">
                        Ảnh bìa
                      </span>
                    )}

                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition
                                    flex items-center justify-center gap-2">
                      {index !== 0 && (
                        <button
                          type="button"
                          onClick={() => handleSetCover(index)}
                          className="w-7 h-7 grid place-items-center rounded-full bg-white text-indigo-600 hover:bg-indigo-50"
                          title="Đặt làm ảnh bìa"
                        >
                          <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                            <path d="M12 2 15 9l7 1-5 5 1.5 7L12 18l-6.5 4L7 15 2 10l7-1 3-7Z" />
                          </svg>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="w-7 h-7 grid place-items-center rounded-full bg-white text-red-600 hover:bg-red-50"
                        title="Xóa ảnh"
                      >
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M18 6 6 18M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {form.imageUrls.length < MAX_IMAGES && (
              <label className={`flex items-center justify-center gap-2 rounded-lg border border-dashed
                                 border-slate-300 dark:border-gray-600 py-3 cursor-pointer transition
                                 ${uploading ? "opacity-60 pointer-events-none" : "hover:border-indigo-400 hover:text-indigo-600"}
                                 text-sm text-slate-400`}>
                {uploading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-slate-300 border-t-indigo-500 rounded-full animate-spin" />
                    Đang tải lên...
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 16V4m0 0 4 4m-4-4-4 4" />
                      <path d="M20 16v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2" />
                    </svg>
                    Thêm ảnh
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFilesSelect}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            )}
            <p className="text-[11px] text-gray-400 mt-1.5">JPG, PNG, WEBP — mỗi ảnh tối đa 5MB</p>
          </div>

          <div className={cardClass}>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Giá & Tồn kho</h3>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Giá bán (đ)</label>
                <input type="number" name="price" required min="0" value={form.price} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Số lượng tồn kho</label>
                <input type="number" name="stock" required min="0" value={form.stock} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Danh mục</label>
                <select name="categoryId" required value={form.categoryId} onChange={handleChange} className={inputClass}>
                  <option value="">-- Chọn danh mục --</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Link
              to="/admin/books"
              className="flex-1 text-center px-5 py-2.5 text-sm font-medium rounded-lg border border-slate-200 dark:border-gray-700
                         text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              Hủy
            </Link>
            <button
              type="submit"
              disabled={loading || uploading}
              className="flex-1 px-5 py-2.5 text-sm font-semibold rounded-lg bg-indigo-600 text-white
                         hover:bg-indigo-700 disabled:opacity-60 shadow-sm shadow-indigo-600/20 transition"
            >
              {loading ? "Đang lưu..." : isEdit ? "Lưu thay đổi" : "Thêm sách"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}