import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const adminNavItems = [
  { to: "/admin", label: "Tổng quan", end: true },
  { to: "/admin/categories", label: "Danh mục" },
  { to: "/admin/products", label: "Sản phẩm" },
  { to: "/admin/product-images", label: "Ảnh sản phẩm" },
  { to: "/admin/variants", label: "Biến thể" },
  { to: "/admin/outfits", label: "Gợi ý trang phục" },
  { to: "/admin/users", label: "Người dùng" },
  { to: "/admin/orders", label: "Đơn hàng" }
];

export default function AdminLayout() {
  const { user, logout } = useAuth();

  return (
    <section className="grid grid-cols-[260px_1fr] min-h-screen bg-admin-bg font-sans">
      <aside className="self-start sticky top-0 bg-admin-sidebar p-6 text-slate-100 min-h-screen shadow-[4px_0_24px_rgba(0,0,0,0.08)] z-20 flex flex-col">
        <div className="mb-8 px-2 pb-6 border-b border-white/10">
          <div className="flex gap-4 items-center mb-6">
            <span className="w-12 h-12 rounded-xl grid place-items-center bg-gradient-to-br from-blue-500 to-blue-600 font-extrabold text-lg shadow-[0_4px_12px_rgba(37,99,235,0.4)]">FS</span>
            <div>
              <span className="text-slate-400 text-xs tracking-wider uppercase block mb-1">Trang quản trị</span>
              <h2 className="text-lg m-0 font-bold text-white">FashionStore</h2>
            </div>
          </div>
          <div className="flex gap-4 items-center p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/5 hover:bg-white/10 transition-colors">
            <div className="w-11 h-11 rounded-full grid place-items-center bg-blue-500 font-bold text-lg shadow-[0_2px_8px_rgba(59,130,246,0.3)]">
              {(user?.full_name || user?.username || "A").slice(0, 1).toUpperCase()}
            </div>
            <div>
              <strong className="block text-sm">{user?.full_name || user?.username}</strong>
              <p className="m-0 mt-0.5 text-slate-400 text-xs">Quản trị viên</p>
            </div>
          </div>
        </div>
        <nav className="grid gap-1.5">
          {adminNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center px-5 py-3.5 rounded-xl font-medium transition-all text-[0.95rem] ${
                  isActive
                    ? "bg-gradient-to-r from-blue-500/20 to-transparent border-l-[3px] border-blue-500 text-white rounded-l-[4px]"
                    : "text-slate-300 hover:bg-blue-500/15 hover:text-white hover:translate-x-1"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto pt-6 px-2 border-t border-white/10">
          <div className="grid gap-3">
            <NavLink to="/" className="inline-flex items-center justify-center px-4 py-3.5 rounded-xl bg-white/5 text-slate-200 font-medium transition-colors hover:bg-white/10 hover:text-white">
              Về trang chủ
            </NavLink>
            <button className="inline-flex items-center justify-center px-4 py-3.5 rounded-xl bg-white/5 text-slate-200 font-medium transition-colors border-none cursor-pointer hover:bg-red-500/20 hover:text-red-400" onClick={logout}>
              Đăng xuất
            </button>
          </div>
        </div>
      </aside>

      <div className="grid content-start gap-6 px-12 py-8 bg-admin-bg min-h-screen">
        <Outlet />
      </div>
    </section>
  );
}
