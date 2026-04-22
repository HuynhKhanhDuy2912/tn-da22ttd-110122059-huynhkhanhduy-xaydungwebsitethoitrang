import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { Home, History, User, LogOut, IdCard } from "lucide-react";

const publicNavItems = [
  { to: "/", label: "TRANG CHỦ" },
  { to: "/products", label: "SẢN PHẨM" }
];

const privateNavItems = [
  { to: "/recommendations", label: "GỢI Ý" },
  { to: "/wishlist", label: "YÊU THÍCH" }
];

export default function Layout() {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const [search, setSearch] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const isAdminView = location.pathname.startsWith("/admin");
  const isAdminUser = user?.role === "admin";
  const clientNavItems = isAuthenticated
    ? [...publicNavItems, ...privateNavItems]
    : publicNavItems;
  const searchHref = useMemo(
    () => `/products${search.trim() ? `?search=${encodeURIComponent(search.trim())}` : ""}`,
    [search]
  );

  return (
    <div className={isAdminView ? "min-h-screen bg-admin-bg font-sans" : "min-h-screen bg-white font-sans text-black"}>
      {!isAdminView ? (
        <>
          <div className="text-center bg-black text-white py-2 px-4 text-xs font-bold tracking-widest uppercase">
            Miễn phí vận chuyển toàn quốc cho đơn từ 500k
          </div>

          <header className="flex flex-col lg:flex-row justify-between items-center px-4 lg:px-8 py-4 bg-white border-b border-gray-200 sticky top-0 z-50 gap-4">
            <div className="flex gap-4 items-center w-full lg:w-auto justify-between lg:justify-start">
              <NavLink to="/" className="text-2xl font-extrabold tracking-[0.15em] uppercase text-black hover:opacity-70 transition-opacity">
                FASHIONSTORE
              </NavLink>
            </div>

            <nav className="flex gap-6 items-center flex-wrap justify-center overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0">
              {clientNavItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => 
                    `text-xs font-bold tracking-widest whitespace-nowrap transition-all uppercase ${isActive ? "text-black border-b-2 border-black pb-1" : "text-gray-500 hover:text-black"}`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <div className="flex flex-col items-end gap-3 w-full lg:w-auto mt-4 lg:mt-0">
              <form
                className="flex items-center border-b border-gray-300 w-full lg:w-[200px]"
                onSubmit={(event) => {
                  event.preventDefault();
                  window.location.href = searchHref;
                }}
              >
                <input
                  className="w-full bg-transparent px-2 py-1.5 text-sm focus:outline-none placeholder-gray-400"
                  placeholder="TÌM KIẾM..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
                <button type="submit" className="text-gray-400 hover:text-black">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </button>
              </form>

              <div className="flex items-center gap-6 mr-2">
                {isAuthenticated ? (
                  <div className="relative">
                    <button 
                      className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-black hover:text-gray-500 cursor-pointer"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                      <div className="w-6 h-6 rounded-full border border-gray-400 flex items-center justify-center">
                        <User className="w-4 h-4" />
                      </div>
                      {user?.full_name || user?.username}
                      <svg className={`w-3 h-3 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </button>
                    
                    {isDropdownOpen && (
                      <div className="absolute left-1/2 -translate-x-1/2 mt-3 w-64 bg-white border border-gray-200 z-50 shadow-xs">
                        {isAdminUser ? (
                          <NavLink to="/admin" className="flex items-center px-4 py-4 text-xs font-bold tracking-widest uppercase text-black hover:bg-gray-50 border-b border-gray-100" onClick={() => setIsDropdownOpen(false)}>
                            <Home className="w-5 h-5 mr-3" />
                            QUẢN TRỊ ADMIN
                          </NavLink>
                        ) : null}
                        <NavLink to="/profile" className="flex items-center px-4 py-4 text-xs font-bold tracking-widest uppercase text-black hover:bg-gray-50 border-b border-gray-100" onClick={() => setIsDropdownOpen(false)}>
                          <IdCard className="w-5 h-5 mr-3" />
                          THÔNG TIN TÀI KHOẢN
                        </NavLink>
                        <NavLink to="/orders" className="flex items-center px-4 py-4 text-xs font-bold tracking-widest uppercase text-black hover:bg-gray-50 border-b border-gray-100" onClick={() => setIsDropdownOpen(false)}>
                          <History className="w-5 h-5 mr-3" />
                          LỊCH SỬ ĐẶT HÀNG
                        </NavLink>
                        <button 
                          className="w-full flex items-center px-4 py-4 text-xs font-bold tracking-widest uppercase text-red-500 hover:bg-gray-50 cursor-pointer" 
                          onClick={() => {
                            setIsDropdownOpen(false);
                            logout();
                          }}
                        >
                          <LogOut className="w-5 h-5 mr-3" />
                          ĐĂNG XUẤT
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <NavLink to="/login" className="text-sm font-bold tracking-widest uppercase hover:text-gray-500 transition-colors">
                      ĐĂNG NHẬP
                    </NavLink>
                    <span className="text-gray-300">|</span>
                    <NavLink to="/register" className="text-sm font-bold tracking-widest uppercase hover:text-gray-500 transition-colors">
                      ĐĂNG KÝ
                    </NavLink>
                  </div>
                )}

                {isAuthenticated && (
                  <NavLink to="/cart" className="text-black hover:text-gray-500 transition-colors cursor-pointer" aria-label="Giỏ hàng">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                  </NavLink>
                )}
              </div>
            </div>
          </header>
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
