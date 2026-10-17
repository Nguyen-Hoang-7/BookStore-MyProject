
import { NavLink } from "react-router-dom";

import {
  BookOpen,
  LayoutDashboard,
  Tags,
  UserRound,
  Building2,
  ShoppingCart,
  UsersRound,
} from "lucide-react";

const menuItems = [
  {
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: LayoutDashboard,
    end: true,
  },
  {
    label: "Quản lý sách",
    path: "/admin/books",
    icon: BookOpen,
  },
  {
    label: "Thể loại",
    path: "/admin/categories",
    icon: Tags,
  },
  {
    label: "Tác giả",
    path: "/admin/authors",
    icon: UserRound,
  },
  {
    label: "Nhà xuất bản",
    path: "/admin/publishers",
    icon: Building2,
  },
  {
    label: "Đơn hàng",
    path: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    label: "Người dùng",
    path: "/admin/users",
    icon: UsersRound,
  },
];

function AdminSidebar({
  collapsed = false,
  mobileOpen = false,
  onNavigate,
}) {
  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-50
        flex h-dvh w-64 flex-col
        overflow-x-hidden overflow-y-auto
        border-r border-slate-200 bg-white
        px-4 py-5
        transition-all duration-300
        ${collapsed ? "md:w-20" : "md:w-64"}
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
      `}
    >
      {/* Logo */}
      <div className="mb-9 flex min-h-11 items-center gap-3 px-2">
        <div
          className="
            flex h-10 w-10 shrink-0 items-center
            justify-center rounded-xl bg-indigo-600
            text-white shadow-sm
          "
        >
          <BookOpen size={23} strokeWidth={2} />
        </div>

        <div
          className={`flex flex-col overflow-hidden ${
            collapsed ? "md:hidden" : ""
          }`}
        >
          <span className="whitespace-nowrap text-lg font-bold text-slate-900">
            BookStore
          </span>

          <span className="text-[10px] font-semibold tracking-[2px] text-slate-400">
            ADMIN PANEL
          </span>
        </div>
      </div>

      {/* Section heading */}
      <div
        className={`
          mb-3 px-3 text-[11px] font-semibold
          uppercase tracking-wider text-slate-400
          ${collapsed ? "md:hidden" : ""}
        `}
      >
        Menu quản lý
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1.5">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              title={collapsed ? item.label : undefined}
              onClick={onNavigate}
              className={({ isActive }) =>
                [
                  "group flex min-h-11 items-center gap-3",
                  "rounded-lg px-3 py-2.5",
                  "text-sm font-medium transition-colors duration-200",

                  isActive
                    ? "bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-100"
                    : "text-slate-600 hover:bg-slate-50 hover:text-indigo-600",

                  collapsed
                    ? "md:justify-center md:px-2"
                    : "",
                ].join(" ")
              }
            >
              <Icon
                size={20}
                strokeWidth={1.8}
                className="shrink-0"
              />

              <span
                className={`truncate ${
                  collapsed ? "md:hidden" : ""
                }`}
              >
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div
        className={`
          mt-auto border-t border-slate-200
          pt-5
          ${collapsed ? "md:hidden" : ""}
        `}
      >
        <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-3">
          <div
            className="
              flex h-9 w-9 shrink-0 items-center
              justify-center rounded-full bg-indigo-100
              text-sm font-bold text-indigo-700
            "
          >
            B
          </div>

          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-slate-800">
              BookStore Admin
            </p>

            <p className="mt-1 text-[11px] text-slate-500">
              Quản lý cửa hàng sách
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default AdminSidebar;
