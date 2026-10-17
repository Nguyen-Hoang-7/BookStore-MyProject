
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
    color: "text-indigo-600",
    bg: "bg-indigo-50",
  },
  {
    title: "Đơn hàng",
    value: 0,
    icon: ShoppingCart,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    title: "Người dùng",
    value: 0,
    icon: Users,
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    title: "Danh mục",
    value: 0,
    icon: Tags,
    color: "text-pink-600",
    bg: "bg-pink-50",
  },
];



export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Tổng quan
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Chào mừng bạn đến với hệ thống quản trị BookStore.
        </p>
      </div>



      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;



          return (
            <div
              key={item.title}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">
                  {item.title}
                </p>



                <div className={`rounded-lg p-3 ${item.bg}`}>
                  <Icon size={22} className={item.color} />
                </div>
              </div>



              <p className="mt-4 text-3xl font-bold text-slate-800">
                {item.value}
              </p>
            </div>
          );
        })}
      </div>



      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800">
          Đơn hàng gần đây
        </h2>



        <p className="mt-2 text-sm text-slate-500">
          Chưa có dữ liệu đơn hàng.
        </p>
      </div>
    </div>
  );
}
 