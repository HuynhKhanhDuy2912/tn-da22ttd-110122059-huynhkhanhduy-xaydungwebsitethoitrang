import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { Home, History, User, LogOut, IdCard, X } from "lucide-react";
import { apiRequest } from "../lib/api.js";

export default function Layout() {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [activeMegaMenu, setActiveMegaMenu] = useState(null); // root _id hoặc null
  const accountRef = useRef(null);

  const isAdminView = location.pathname.startsWith("/admin");
  const isAdminUser = user?.role === "admin";

  const searchHref = useMemo(
    () => `/products${search.trim() ? `?search=${encodeURIComponent(search.trim())}` : ""}`,
    [search]
  );

  // Đóng mega menu khi route thay đổi
  useEffect(() => { setActiveMegaMenu(null); }, [location.pathname, location.search]);

  // Fetch categories
  useEffect(() => {
    apiRequest("/categories").then(res => setCategories(res.data || [])).catch(() => {});
  }, []);

  // Đóng account dropdown khi click ngoài
  useEffect(() => {
    const handleClick = (e) => {
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setIsAccountOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const rootCategories = categories.filter(c => !c.parentId);
  const childrenOf = (rootId) => categories.filter(c => c.parentId?._id === rootId);
  const activeMegaRoot = rootCategories.find(r => r._id === activeMegaMenu);

  const handleCategoryClick = (categoryId) => {
    setActiveMegaMenu(null);
    navigate(`/products?categoryId=${categoryId}`);
  };

  const toggleMegaMenu = (rootId) => {
    const children = childrenOf(rootId);
    if (children.length === 0) {
      // Không có con → điều hướng thẳng
      handleCategoryClick(rootId);
    } else {
      setActiveMegaMenu(prev => prev === rootId ? null : rootId);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-black">
      {!isAdminView ? (
        <>
          {/* Banner */}
          <div className="text-center bg-black text-white py-2 px-4 text-xs font-bold tracking-widest uppercase">
            Miễn phí vận chuyển toàn quốc cho đơn từ 500k
          </div>

          {/* ── Header ── */}
          <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="flex justify-between items-center px-4 lg:px-8 py-4 gap-4">

              {/* Logo */}
              <NavLink
                to="/"
                className="text-2xl font-extrabold tracking-[0.15em] uppercase text-black hover:opacity-70 transition-opacity shrink-0"
              >
                FASHIONSTORE
              </NavLink>

              {/* Nav */}
              <nav className="flex gap-1 items-center flex-wrap">
                {/* TRANG CHỦ */}
                <NavLink
                  to="/"
                  end
                  className={({ isActive }) =>
                    `px-3 py-2 text-xs font-bold tracking-widest uppercase transition-all whitespace-nowrap ${isActive ? "text-black border-b-2 border-black" : "text-gray-500 hover:text-black"}`
                  }
                >
                  TRANG CHỦ
                </NavLink>

                {/* Danh mục gốc từ API */}
                {rootCategories.map(root => {
                  const isActive = activeMegaMenu === root._id;
                  return (
                    <button
                      key={root._id}
                      onClick={() => toggleMegaMenu(root._id)}
                      className={`px-3 py-2 text-xs font-bold tracking-widest uppercase transition-all whitespace-nowrap border-none bg-transparent cursor-pointer ${isActive ? "text-black border-b-2 border-black" : "text-gray-500 hover:text-black"}`}
                    >
                      {root.name}
                    </button>
                  );
                })}

                {/* GỢI Ý + YÊU THÍCH */}
                {isAuthenticated && (
                  <>
                    <NavLink
                      to="/recommendations"
                      className={({ isActive }) =>
                        `px-3 py-2 text-xs font-bold tracking-widest uppercase transition-all whitespace-nowrap ${isActive ? "text-black border-b-2 border-black" : "text-gray-500 hover:text-black"}`
                      }
                    >
                      GỢI Ý
                    </NavLink>
                    <NavLink
                      to="/wishlist"
                      className={({ isActive }) =>
                        `px-3 py-2 text-xs font-bold tracking-widest uppercase transition-all whitespace-nowrap ${isActive ? "text-black border-b-2 border-black" : "text-gray-500 hover:text-black"}`
                      }
                    >
                      YÊU THÍCH
                    </NavLink>
                  </>
                )}
              </nav>

              {/* Right: Search + Account + Cart */}
              <div className="flex flex-col items-end gap-3 shrink-0">
                {/* Search */}
                <form
                  className="flex items-center border-b border-gray-300 w-[180px]"
                  onSubmit={(e) => { e.preventDefault(); window.location.href = searchHref; }}
                >
                  <input
                    className="w-full bg-transparent px-2 py-1.5 text-sm focus:outline-none placeholder-gray-400"
                    placeholder="TÌM KIẾM..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <button type="submit" className="text-gray-400 hover:text-black">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </form>

                {/* Account + Cart */}
                <div className="flex items-center gap-6 mr-2">
                  {isAuthenticated ? (
                    <div className="relative" ref={accountRef}>
                      <button
                        className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-black hover:text-gray-500 cursor-pointer border-none bg-transparent"
                        onClick={() => setIsAccountOpen(!isAccountOpen)}
                      >
                        <div className="w-6 h-6 rounded-full border border-gray-400 flex items-center justify-center">
                          <User className="w-4 h-4" />
                        </div>
                        {user?.full_name || user?.username}
                        <svg className={`w-3 h-3 transition-transform ${isAccountOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {isAccountOpen && (
                        <div className="absolute left-1/2 -translate-x-1/2 mt-3 w-64 bg-white border border-gray-200 z-50 shadow-xs">
                          {isAdminUser && (
                            <NavLink to="/admin" className="flex items-center px-4 py-4 text-xs font-bold tracking-widest uppercase text-black hover:bg-gray-50 border-b border-gray-100" onClick={() => setIsAccountOpen(false)}>
                              <Home className="w-5 h-5 mr-3" /> QUẢN TRỊ ADMIN
                            </NavLink>
                          )}
                          <NavLink to="/profile" className="flex items-center px-4 py-4 text-xs font-bold tracking-widest uppercase text-black hover:bg-gray-50 border-b border-gray-100" onClick={() => setIsAccountOpen(false)}>
                            <IdCard className="w-5 h-5 mr-3" /> THÔNG TIN TÀI KHOẢN
                          </NavLink>
                          <NavLink to="/orders" className="flex items-center px-4 py-4 text-xs font-bold tracking-widest uppercase text-black hover:bg-gray-50 border-b border-gray-100" onClick={() => setIsAccountOpen(false)}>
                            <History className="w-5 h-5 mr-3" /> LỊCH SỬ ĐẶT HÀNG
                          </NavLink>
                          <button
                            className="w-full flex items-center px-4 py-4 text-xs font-bold tracking-widest uppercase text-red-500 hover:bg-gray-50 cursor-pointer border-none bg-white"
                            onClick={() => { setIsAccountOpen(false); logout(); }}
                          >
                            <LogOut className="w-5 h-5 mr-3" /> ĐĂNG XUẤT
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-4">
                      <NavLink to="/login" className="text-sm font-bold tracking-widest uppercase hover:text-gray-500 transition-colors">ĐĂNG NHẬP</NavLink>
                      <span className="text-gray-300">|</span>
                      <NavLink to="/register" className="text-sm font-bold tracking-widest uppercase hover:text-gray-500 transition-colors">ĐĂNG KÝ</NavLink>
                    </div>
                  )}

                  {isAuthenticated && (
                    <NavLink to="/cart" className="text-black hover:text-gray-500 transition-colors cursor-pointer" aria-label="Giỏ hàng">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </NavLink>
                  )}
                </div>
              </div>
            </div>
          </header>

          {/* ── Mega Menu Overlay (kiểu Routine.vn) ── */}
          {activeMegaMenu && activeMegaRoot && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 bg-black/30 z-40"
                onClick={() => setActiveMegaMenu(null)}
              />

              {/* Menu panel */}
              <div className="fixed left-0 right-0 top-[133px] z-50 bg-white shadow-xl border-t border-gray-200 max-h-[80vh] overflow-y-auto">
                <div className="max-w-[1200px] mx-auto px-8 py-10">

                  {/* Header của mega menu */}
                  <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-4">
                      <h2 className="text-xl font-extrabold uppercase tracking-widest text-black">
                        {activeMegaRoot.name}
                      </h2>
                      <button
                        onClick={() => handleCategoryClick(activeMegaRoot._id)}
                        className="text-xs text-gray-400 uppercase tracking-widest underline hover:text-black transition-colors bg-transparent border-none cursor-pointer"
                      >
                        Xem tất cả
                      </button>
                    </div>
                    <button
                      onClick={() => setActiveMegaMenu(null)}
                      className="flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors bg-transparent border-none cursor-pointer"
                    >
                      <X size={16} />
                      ĐÓNG
                    </button>
                  </div>

                  {/* Grid danh mục con — 4 cột */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                    {childrenOf(activeMegaRoot._id).map(child => (
                      <button
                        key={child._id}
                        onClick={() => handleCategoryClick(child._id)}
                        className="flex items-center gap-4 p-4 text-left hover:bg-gray-50 transition-colors group cursor-pointer bg-transparent border border-transparent hover:border-gray-200"
                      >
                        {/* Placeholder icon (hình chữ nhật mô phỏng) */}
                        <div className="w-10 h-10 shrink-0 bg-gray-100 flex items-center justify-center">
                          <svg viewBox="0 0 40 40" className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <rect x="8" y="6" width="24" height="28" rx="2" />
                            <path d="M14 6v4M26 6v4" />
                          </svg>
                        </div>
                        <span className="text-sm font-medium text-gray-700 group-hover:text-black transition-colors uppercase tracking-widest leading-tight">
                          {child.name}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Search bar dưới cùng (như Routine.vn) */}
                  <div className="mt-10 pt-6 border-t border-gray-100 flex items-center justify-center">
                    <form
                      className="flex items-center border border-gray-300 px-4 py-3 w-full max-w-md gap-3"
                      onSubmit={(e) => {
                        e.preventDefault();
                        setActiveMegaMenu(null);
                        window.location.href = searchHref;
                      }}
                    >
                      <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <input
                        className="flex-1 bg-transparent text-sm focus:outline-none placeholder-gray-400"
                        placeholder="Tìm kiếm sản phẩm..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    </form>
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      ) : null}

      <main className={isAdminView ? "" : "w-full max-w-[1400px] mx-auto p-4 lg:p-8"}>
        <Outlet />
      </main>

      {!isAdminView ? (
        <footer className="bg-white border-t border-gray-100 py-12 mt-16">
          <div className="max-w-[1400px] mx-auto px-4 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-extrabold tracking-[0.1em] uppercase mb-4">FASHIONSTORE</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-4">
                Thương hiệu thời trang nam nữ mang phong cách tối giản, hiện đại và trẻ trung.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-bold tracking-widest uppercase mb-4">VỀ CHÚNG TÔI</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><a href="#" className="hover:text-black">Câu chuyện thương hiệu</a></li>
                <li><a href="#" className="hover:text-black">Tuyển dụng</a></li>
                <li><a href="#" className="hover:text-black">Liên hệ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-bold tracking-widest uppercase mb-4">CHÍNH SÁCH</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><a href="#" className="hover:text-black">Chính sách đổi trả</a></li>
                <li><a href="#" className="hover:text-black">Chính sách bảo mật</a></li>
                <li><a href="#" className="hover:text-black">Hướng dẫn mua hàng</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-bold tracking-widest uppercase mb-4">ĐĂNG KÝ NHẬN TIN</h4>
              <div className="flex border-b border-black pb-2">
                <input type="email" placeholder="Nhập email của bạn" className="bg-transparent w-full focus:outline-none text-sm" />
                <button className="text-xs font-bold uppercase hover:text-gray-500">Gửi</button>
              </div>
            </div>
          </div>
          <div className="max-w-[1400px] mx-auto px-4 lg:px-8 mt-12 pt-8 border-t border-gray-100 text-xs text-gray-400 flex flex-col md:flex-row justify-between items-center">
            <p>© 2024 FASHIONSTORE. All rights reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="#" className="hover:text-black">Facebook</a>
              <a href="#" className="hover:text-black">Instagram</a>
              <a href="#" className="hover:text-black">Tiktok</a>
            </div>
          </div>
        </footer>
      ) : null}
    </div>
  );
}
