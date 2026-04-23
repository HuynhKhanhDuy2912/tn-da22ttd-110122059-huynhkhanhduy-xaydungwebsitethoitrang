import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { Home, History, IdCard, LogOut, Search, User, X } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { apiRequest } from "../lib/api.js";

export default function Layout() {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const accountRef = useRef(null);
  const [search, setSearch] = useState("");
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [activeMegaMenu, setActiveMegaMenu] = useState(null);

  const isAdminView = location.pathname.startsWith("/admin");
  const isAdminUser = user?.role === "admin";

  const searchHref = useMemo(
    () => `/products${search.trim() ? `?search=${encodeURIComponent(search.trim())}` : ""}`,
    [search]
  );

  useEffect(() => {
    setActiveMegaMenu(null);
  }, [location.pathname, location.search]);

  useEffect(() => {
    apiRequest("/categories")
      .then((response) => setCategories(response.data || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handleClick = (event) => {
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setIsAccountOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const rootCategories = categories.filter((category) => !category.parentId);
  const childrenOf = (rootId) =>
    categories.filter((category) => category.parentId?._id === rootId);
  const activeMegaRoot = rootCategories.find((root) => root._id === activeMegaMenu);
  const activeChildren = activeMegaRoot ? childrenOf(activeMegaRoot._id) : [];

  const handleCategoryClick = (categoryId) => {
    setActiveMegaMenu(null);
    navigate(`/products?categoryId=${categoryId}`);
  };

  const toggleMegaMenu = (rootId) => {
    const children = childrenOf(rootId);

    if (children.length === 0) {
      handleCategoryClick(rootId);
      return;
    }

    setActiveMegaMenu((current) => (current === rootId ? null : rootId));
  };

  const topHighlights = activeChildren.slice(0, 4);

  return (
    <div className="min-h-screen bg-white font-sans text-black">
      {!isAdminView ? (
        <>
          <div className="bg-black px-4 py-2 text-center text-xs font-bold uppercase tracking-[0.25em] text-white">
            Miễn phí vận chuyển toàn quốc cho đơn từ 500K
          </div>

          <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
            <div className="flex items-center justify-between gap-6 px-4 py-4 lg:px-8">
              <div className="flex items-center gap-8">
                <NavLink
                  to="/"
                  className="text-2xl font-extrabold uppercase tracking-[0.15em] text-black transition-opacity hover:opacity-70"
                >
                  FashionStore
                </NavLink>

                <nav className="hidden items-center gap-1 lg:flex">
                  <NavLink
                    to="/"
                    end
                    className={({ isActive }) =>
                      `px-3 py-2 text-xs font-bold uppercase tracking-widest transition ${
                        isActive
                          ? "border-b-2 border-black text-black"
                          : "text-gray-500 hover:text-black"
                      }`
                    }
                  >
                    Trang chủ
                  </NavLink>

                  {rootCategories.map((root) => {
                    const isActive = activeMegaMenu === root._id;
                    return (
                      <button
                        key={root._id}
                        type="button"
                        onClick={() => toggleMegaMenu(root._id)}
                        className={`border-none bg-transparent px-3 py-2 text-xs font-bold uppercase tracking-widest transition ${
                          isActive
                            ? "border-b-2 border-black text-black"
                            : "text-gray-500 hover:text-black"
                        }`}
                      >
                        {root.name}
                      </button>
                    );
                  })}

                  {isAuthenticated ? (
                    <>
                      <NavLink
                        to="/recommendations"
                        className={({ isActive }) =>
                          `px-3 py-2 text-xs font-bold uppercase tracking-widest transition ${
                            isActive
                              ? "border-b-2 border-black text-black"
                              : "text-gray-500 hover:text-black"
                          }`
                        }
                      >
                        Gợi ý
                      </NavLink>
                      <NavLink
                        to="/wishlist"
                        className={({ isActive }) =>
                          `px-3 py-2 text-xs font-bold uppercase tracking-widest transition ${
                            isActive
                              ? "border-b-2 border-black text-black"
                              : "text-gray-500 hover:text-black"
                          }`
                        }
                      >
                        Yêu thích
                      </NavLink>
                    </>
                  ) : null}
                </nav>
              </div>

              <div className="flex items-center gap-6">
                <form
                  className="hidden items-center gap-2 border-b border-gray-300 px-1 pb-1 lg:flex"
                  onSubmit={(event) => {
                    event.preventDefault();
                    window.location.href = searchHref;
                  }}
                >
                  <Search size={16} className="text-gray-400" />
                  <input
                    className="w-[170px] bg-transparent text-sm outline-none placeholder:text-gray-400"
                    placeholder="Tìm kiếm..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                  />
                </form>

                {isAuthenticated ? (
                  <div className="relative" ref={accountRef}>
                    <button
                      type="button"
                      className="flex items-center gap-2 border-none bg-transparent text-xs font-bold uppercase tracking-widest text-black transition hover:text-gray-500"
                      onClick={() => setIsAccountOpen((current) => !current)}
                    >
                      <span className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-400">
                        <User className="h-4 w-4" />
                      </span>
                      {user?.full_name || user?.username}
                    </button>

                    {isAccountOpen ? (
                      <div className="absolute right-0 mt-3 w-64 border border-gray-200 bg-white shadow-lg">
                        {isAdminUser ? (
                          <NavLink
                            to="/admin"
                            className="flex items-center gap-3 border-b border-gray-100 px-4 py-4 text-xs font-bold uppercase tracking-widest text-black transition hover:bg-gray-50"
                            onClick={() => setIsAccountOpen(false)}
                          >
                            <Home className="h-4 w-4" />
                            Quản trị admin
                          </NavLink>
                        ) : null}

                        <NavLink
                          to="/profile"
                          className="flex items-center gap-3 border-b border-gray-100 px-4 py-4 text-xs font-bold uppercase tracking-widest text-black transition hover:bg-gray-50"
                          onClick={() => setIsAccountOpen(false)}
                        >
                          <IdCard className="h-4 w-4" />
                          Thông tin tài khoản
                        </NavLink>

                        <NavLink
                          to="/orders"
                          className="flex items-center gap-3 border-b border-gray-100 px-4 py-4 text-xs font-bold uppercase tracking-widest text-black transition hover:bg-gray-50"
                          onClick={() => setIsAccountOpen(false)}
                        >
                          <History className="h-4 w-4" />
                          Lịch sử đặt hàng
                        </NavLink>

                        <button
                          type="button"
                          className="flex w-full items-center gap-3 border-none bg-white px-4 py-4 text-xs font-bold uppercase tracking-widest text-red-500 transition hover:bg-gray-50"
                          onClick={() => {
                            setIsAccountOpen(false);
                            logout();
                          }}
                        >
                          <LogOut className="h-4 w-4" />
                          Đăng xuất
                        </button>
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <NavLink
                      to="/login"
                      className="text-sm font-bold uppercase tracking-widest transition hover:text-gray-500"
                    >
                      Đăng nhập
                    </NavLink>
                    <span className="text-gray-300">|</span>
                    <NavLink
                      to="/register"
                      className="text-sm font-bold uppercase tracking-widest transition hover:text-gray-500"
                    >
                      Đăng ký
                    </NavLink>
                  </div>
                )}

                {isAuthenticated ? (
                  <NavLink
                    to="/cart"
                    className="text-black transition hover:text-gray-500"
                    aria-label="Giỏ hàng"
                  >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                  </NavLink>
                ) : null}
              </div>
            </div>
          </header>

          {activeMegaMenu && activeMegaRoot ? (
            <>
              <div
                className="fixed inset-0 z-40 bg-black/30"
                onClick={() => setActiveMegaMenu(null)}
              />

              <div className="fixed left-0 right-0 top-[89px] z-50 max-h-[82vh] overflow-y-auto border-t border-gray-200 bg-white shadow-xl">
                <div className="mx-auto max-w-[1280px] px-6 py-8 lg:px-10">
                  <div className="mb-8 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <h2 className="text-xl font-extrabold uppercase tracking-[0.18em] text-black">
                        {activeMegaRoot.name}
                      </h2>
                      <button
                        type="button"
                        onClick={() => handleCategoryClick(activeMegaRoot._id)}
                        className="border-none bg-transparent text-xs font-bold uppercase tracking-widest text-gray-400 underline transition hover:text-black"
                      >
                        Xem tất cả
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveMegaMenu(null)}
                      className="flex items-center gap-2 border-none bg-transparent text-xs font-bold uppercase tracking-widest text-gray-500 transition hover:text-black"
                    >
                      <X size={16} />
                      Đóng
                    </button>
                  </div>

                  {topHighlights.length > 0 ? (
                    <div className="mb-8 grid gap-4 border-b border-gray-100 pb-8 md:grid-cols-2 xl:grid-cols-4">
                      {topHighlights.map((child) => (
                        <button
                          key={`highlight-${child._id}`}
                          type="button"
                          onClick={() => handleCategoryClick(child._id)}
                          className="group grid gap-3 border border-gray-200 bg-white p-4 text-left transition hover:border-black"
                        >
                          <div className="aspect-[4/2.3] overflow-hidden bg-gray-100">
                            {child.imageUrl ? (
                              <img
                                src={child.imageUrl}
                                alt={child.name}
                                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                              />
                            ) : (
                              <div className="grid h-full w-full place-items-center text-[11px] font-bold uppercase tracking-[0.25em] text-gray-300">
                                No image
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-gray-400">
                              Nổi bật
                            </p>
                            <p className="mt-2 text-sm font-bold uppercase tracking-widest text-black">
                              {child.name}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : null}

                  <div className="grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {activeChildren.map((child) => (
                      <button
                        key={child._id}
                        type="button"
                        onClick={() => handleCategoryClick(child._id)}
                        className="group flex items-center gap-4 rounded-sm border border-transparent px-3 py-3 text-left transition hover:border-gray-200 hover:bg-gray-50"
                      >
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden border border-gray-200 bg-white">
                          {child.imageUrl ? (
                            <img
                              src={child.imageUrl}
                              alt={child.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="grid h-full w-full place-items-center text-[10px] font-bold uppercase tracking-[0.2em] text-gray-300">
                              IMG
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium uppercase tracking-widest text-gray-700 transition group-hover:text-black">
                            {child.name}
                          </p>
                          <p className="mt-1 text-[11px] uppercase tracking-[0.22em] text-gray-400">
                            Danh mục con
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="mt-8 border-t border-gray-100 pt-6">
                    <form
                      className="mx-auto flex w-full max-w-xl items-center gap-3 border border-gray-300 px-4 py-3"
                      onSubmit={(event) => {
                        event.preventDefault();
                        setActiveMegaMenu(null);
                        window.location.href = searchHref;
                      }}
                    >
                      <Search className="h-4 w-4 shrink-0 text-gray-400" />
                      <input
                        className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
                        placeholder="Tìm kiếm sản phẩm..."
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                      />
                    </form>
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </>
      ) : null}

      <main className={isAdminView ? "" : "mx-auto w-full max-w-[1400px] p-4 lg:p-8"}>
        <Outlet />
      </main>

      {!isAdminView ? (
        <footer className="mt-16 border-t border-gray-100 bg-white py-12">
          <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-8 px-4 lg:px-8 md:grid-cols-4">
            <div>
              <h3 className="mb-4 text-lg font-extrabold uppercase tracking-[0.1em]">FashionStore</h3>
              <p className="mb-4 text-sm leading-relaxed text-gray-500">
                Thương hiệu thời trang nam nữ mang phong cách tối giản, hiện đại và trẻ trung.
              </p>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-bold uppercase tracking-widest">Về chúng tôi</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><a href="#" className="hover:text-black">Câu chuyện thương hiệu</a></li>
                <li><a href="#" className="hover:text-black">Tuyển dụng</a></li>
                <li><a href="#" className="hover:text-black">Liên hệ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-bold uppercase tracking-widest">Chính sách</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><a href="#" className="hover:text-black">Chính sách đổi trả</a></li>
                <li><a href="#" className="hover:text-black">Chính sách bảo mật</a></li>
                <li><a href="#" className="hover:text-black">Hướng dẫn mua hàng</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-bold uppercase tracking-widest">Đăng ký nhận tin</h4>
              <div className="flex border-b border-black pb-2">
                <input
                  type="email"
                  placeholder="Nhập email của bạn"
                  className="w-full bg-transparent text-sm outline-none"
                />
                <button className="text-xs font-bold uppercase hover:text-gray-500">Gửi</button>
              </div>
            </div>
          </div>
          <div className="mx-auto mt-12 flex max-w-[1400px] flex-col items-center justify-between border-t border-gray-100 px-4 pt-8 text-xs text-gray-400 md:flex-row lg:px-8">
            <p>© 2024 FashionStore. All rights reserved.</p>
            <div className="mt-4 flex gap-4 md:mt-0">
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
