import {
  BookOpen,
  ShoppingCart,
  Users,
  Tags,
} from "lucide-react";

const stats = [
  {
    title: "Tổng sách",
    value: 0,
    icon: BookOpen,
    color: "text-indigo-600 dark:text-indigo-400",
    bg: "bg-indigo-50 dark:bg-indigo-500/15",
  },
  {
    title: "Đơn hàng",
    value: 0,
    icon: ShoppingCart,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-500/15",
  },
  {
    title: "Người dùng",
    value: 0,
    icon: Users,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-500/15",
  },
  {
    title: "Danh mục",
    value: 0,
    icon: Tags,
    color: "text-pink-600 dark:text-pink-400",
    bg: "bg-pink-50 dark:bg-pink-500/15",
  },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
          Tổng quan
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Chào mừng bạn đến với hệ thống quản trị BookStore.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  {item.title}
                </p>

                <div className={`rounded-lg p-3 ${item.bg}`}>
                  <Icon size={22} className={item.color} />
                </div>
              </div>

              <p className="mt-4 text-3xl font-bold text-slate-800 dark:text-white">
                {item.value}
              </p>
            </div>
          );
        })}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
          Đơn hàng gần đây
        </h2>

        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Chưa có dữ liệu đơn hàng.
        </p>
      </div>
    </div>
  );
}