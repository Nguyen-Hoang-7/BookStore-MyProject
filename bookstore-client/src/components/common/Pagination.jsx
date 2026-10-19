// src/components/common/Pagination.jsx
export default function Pagination({ page, totalPages, onChange }) {
    if (totalPages <= 1) return null;
  
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  
    return (
      <div className="flex items-center justify-center gap-1 mt-4">
        <button
          onClick={() => onChange(page - 1)}
          disabled={page === 1}
          className="px-3 py-1.5 text-sm rounded-lg border border-slate-200 dark:border-gray-700
                     text-gray-600 dark:text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed
                     hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          ←
        </button>
  
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={`px-3 py-1.5 text-sm rounded-lg transition
              ${p === page
                ? "bg-indigo-600 text-white"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"}`}
          >
            {p}
          </button>
        ))}
  
        <button
          onClick={() => onChange(page + 1)}
          disabled={page === totalPages}
          className="px-3 py-1.5 text-sm rounded-lg border border-slate-200 dark:border-gray-700
                     text-gray-600 dark:text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed
                     hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          →
        </button>
      </div>
    );
  }