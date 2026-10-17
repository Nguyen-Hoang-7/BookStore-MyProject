
import { useState } from "react";

import {
  Bell,
  ChevronRight,
  House,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  LogOut 
} from "lucide-react";

function AdminHeader({
  collapsed = false,
  onToggleSidebar,
  onToggleMobileSidebar,
  userName = "Administrator",
  userRole = "Quản trị viên",
  onLogout,
}) {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header
      className={`
        sticky top-0 z-30
        flex h-[76px] items-center justify-between gap-4
        border-b border-slate-200 bg-white
        px-4 transition-[margin] duration-300 md:px-6
        ${collapsed ? "md:ml-20" : "md:ml-64"}
      `}
    >
      {/* Left: sidebar toggle + breadcrumb */}
      <div className="flex min-w-0 items-center gap-3 md:gap-4">
        {/* Desktop sidebar toggle */}
        <button
          type="button"
          onClick={onToggleSidebar}
          className="
            hidden h-10 w-10 shrink-0 items-center
            justify-center rounded-lg border border-slate-200
            text-slate-600 transition hover:bg-slate-50
            hover:text-indigo-600 md:flex
          "
          aria-label={
            collapsed
              ? "Mở rộng sidebar"
              : "Thu gọn sidebar"
          }
          title={
            collapsed
              ? "Mở rộng sidebar"
              : "Thu gọn sidebar"
          }
        >
          {collapsed ? (
            <PanelLeftOpen size={20} />
          ) : (
            <PanelLeftClose size={20} />
          )}
        </button>

        {/* Mobile sidebar toggle */}
        <button
          type="button"
          onClick={onToggleMobileSidebar}
          className="
            flex h-10 w-10 shrink-0 items-center
            justify-center rounded-lg border border-slate-200
            text-slate-600 transition hover:bg-slate-50
            hover:text-indigo-600 md:hidden cursor-pointer
          "
          aria-label="Mở menu quản trị"
          title="Mở menu quản trị"
        >
          <Menu size={21} />
        </button>

        {/* Breadcrumb */}
        <div className="flex min-w-0 items-center gap-2 text-sm">
          <House
            size={17}
            className="shrink-0 text-slate-400"
          />

          <ChevronRight
            size={15}
            className="shrink-0 text-slate-300"
          />

          <span className="truncate font-medium text-slate-700">
            Quản trị
          </span>
        </div>
      </div>

      {/* Right: search + notification + profile */}
      <div className="flex shrink-0 items-center gap-2 sm:gap-4">
        {/* Search */}
        <div
          className="
            hidden h-10 w-64 items-center gap-2
            rounded-lg border border-slate-200
            bg-slate-50 px-3
            transition focus-within:border-indigo-400
            focus-within:ring-2 focus-within:ring-indigo-100
            lg:flex
          "
        >
          <Search
            size={18}
            className="shrink-0 text-slate-400"
          />

          <input
            type="search"
            placeholder="Tìm kiếm..."
            aria-label="Tìm kiếm"
            className="
              min-w-0 flex-1 bg-transparent
              text-sm text-slate-700 outline-none
              placeholder:text-slate-400
            "
          />
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            type="button"
            onClick={() =>
              setShowNotifications((previous) => !previous)
            }
            aria-expanded={showNotifications}
            aria-label="Xem thông báo"
            title="Thông báo"
            className="
              relative flex h-10 w-10 items-center cursor-pointer
              justify-center rounded-lg
              text-slate-600 transition
              hover:bg-slate-100 hover:text-indigo-600
            "
          >
            <Bell size={21} strokeWidth={1.8} />

            <span
              className="
                absolute right-2 top-2 h-2 w-2
                rounded-full border-2 border-white
                bg-rose-500
              "
            />
          </button>

          {showNotifications && (
            <div
              className="
                absolute right-0 top-full z-50 mt-3
                w-72 max-w-[calc(100vw-2rem)]
                overflow-hidden rounded-xl
                border border-slate-200 bg-white
                shadow-lg shadow-slate-200/60
              "
            >
              <div className="border-b border-slate-100 px-4 py-3">
                <h3 className="text-sm font-semibold text-slate-800">
                  Thông báo
                </h3>
              </div>

              <div className="px-4 py-6 text-center">
                <Bell
                  size={24}
                  className="mx-auto mb-2 text-slate-300"
                />

                <p className="text-sm text-slate-600">
                  Chưa có thông báo mới.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Administrator profile */}
        <div className="flex items-center gap-3 border-l border-slate-200 pl-3 sm:pl-4">
          <div
            className="
              flex h-10 w-10 shrink-0 items-center
              justify-center rounded-full
              bg-indigo-100 text-sm font-semibold
              text-indigo-700 ring-1 ring-indigo-200
            "
          >
            {userName.charAt(0).toUpperCase()}
          </div>

          <div className="hidden min-w-0 sm:block">
            <p className="max-w-36 truncate text-sm font-semibold text-slate-800">
              {userName}
            </p>

            <p className="mt-0.5 text-xs text-slate-500">
              {userRole}
            </p>
          </div>
        </div>

        <button
            type="button"
            onClick={onLogout}
            className="
                flex items-center gap-2 rounded-lg
                border border-slate-200 px-3 py-2
                text-sm font-medium text-slate-600 cursor-pointer
                transition hover:bg-red-50 hover:text-red-600
            "
            >
            <LogOut size={17} />
            <span className="hidden lg:inline">Đăng xuất</span>
        </button>
        
      </div>
    </header>
  );
}

export default AdminHeader;
