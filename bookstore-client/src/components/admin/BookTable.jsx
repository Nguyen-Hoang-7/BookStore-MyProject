// src/components/admin/BookTable.jsx
export default function BookTable({ books, onEdit, onDelete }) {
    return (
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-gray-800">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-left">
              <th className="px-4 py-3 font-medium">Sách</th>
              <th className="px-4 py-3 font-medium">Danh mục</th>
              <th className="px-4 py-3 font-medium">Giá</th>
              <th className="px-4 py-3 font-medium">Tồn kho</th>
              <th className="px-4 py-3 font-medium text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-gray-800">
            {books.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-gray-400">
                  Chưa có sách nào.
                </td>
              </tr>
            )}
  
            {books.map((book) => (
              <tr key={book.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={book.imageUrls?.[0] || "https://placehold.co/40x56"}
                      alt={book.name}
                      className="w-10 h-14 object-cover rounded-md border border-slate-200 dark:border-gray-700"
                    />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white line-clamp-1">{book.name}</p>
                      {book.bookDetail?.authors?.length > 0 && (
                        <p className="text-xs text-gray-400">
                          {book.bookDetail.authors.map((a) => a.name).join(", ")}
                        </p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{book.categoryName}</td>
                <td className="px-4 py-3 text-gray-900 dark:text-white font-medium">
                  {book.price.toLocaleString("vi-VN")} đ
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium
                    ${book.stock > 0
                      ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400"}`}>
                    {book.stock > 0 ? `${book.stock} cuốn` : "Hết hàng"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => onEdit(book)}
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium mr-3"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => onDelete(book)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }