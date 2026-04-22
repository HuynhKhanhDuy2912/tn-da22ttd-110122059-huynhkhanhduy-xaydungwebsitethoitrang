import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

const publicNavItems = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Products" }
];

const privateNavItems = [
  { to: "/recommendations", label: "Recommendations" },
  { to: "/wishlist", label: "Wishlist" },
  { to: "/cart", label: "Cart" },
  { to: "/orders", label: "Orders" }
];

export default function Layout() {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const [search, setSearch] = useState("");
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
    <div className={isAdminView ? "min-h-screen bg-admin-bg font-sans" : "min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(201,173,141,0.18),transparent_24%),linear-gradient(180deg,#f6f1ea_0%,#fbf8f4_48%,#f0ece7_100%)] font-serif text-brand-text leading-relaxed"}>
      {!isAdminView ? (
        <>
          <div className="text-center bg-[#241b15] text-[#f4ebe2] py-1.5 px-3 text-xs tracking-wider uppercase">FashionStore personalized shopping experience</div>

          <header className="grid grid-cols-[auto_minmax(180px,280px)_1fr_auto] gap-4 px-5 py-3 bg-[#fffcf8]/85 border-b border-brand-line backdrop-blur-md sticky top-0 z-10 items-center">
            <div className="flex gap-2.5 items-center">
              <span className="w-10 h-10 rounded-full grid place-items-center bg-gradient-to-br from-brand-primary to-brand-primary-deep text-white font-bold tracking-wider">FS</span>
              <div>
                <h1 className="m-0 text-lg font-bold">FashionStore</h1>
                <p className="m-0 text-xs text-brand-muted">Modern fashion storefront</p>
              </div>
            </div>

            <form
              className="flex"
              onSubmit={(event) => {
                event.preventDefault();
                window.location.href = searchHref;
              }}
            >
              <input
                className="w-full rounded-full bg-white/95 px-4 py-2.5 text-[0.92rem] border border-[#d7ccbf] focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                placeholder="Search shirts, jackets, streetwear..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </form>

            <nav className="flex gap-2.5 items-center flex-wrap">
              {clientNavItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => 
                    `px-3 py-1.5 rounded-full text-[0.92rem] whitespace-nowrap transition-colors ${isActive ? "bg-brand-primary/10" : "hover:bg-brand-primary/10"}`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              {isAdminUser ? (
                <NavLink
                  to="/admin"
                  className={({ isActive }) => 
                    `px-3 py-1.5 rounded-full text-[0.92rem] whitespace-nowrap transition-colors ${isActive ? "bg-brand-primary/10" : "hover:bg-brand-primary/10"}`
                  }
                >
                  Admin
                </NavLink>
              ) : null}
            </nav>

            <div className="flex gap-2.5 items-center flex-wrap">
              {isAuthenticated ? (
                <>
                  <div className="grid gap-0.5 px-3 py-1.5 rounded-2xl bg-brand-primary/5 border border-brand-line">
                    <span className="text-brand-muted text-xs">Signed in as</span>
                    <div className="flex items-center gap-2">
                      <strong className="text-sm">{user?.full_name || user?.username}</strong>
                      <span className={`px-2 py-0.5 rounded-full text-[0.68rem] font-bold tracking-wider uppercase ${isAdminUser ? "bg-blue-500/20 text-blue-600" : "bg-brand-primary/15 text-brand-primary-deep"}`}>
                        {isAdminUser ? "Admin" : "User"}
                      </span>
                    </div>
                  </div>
                  <button className="px-4 py-2 rounded-full border border-brand-line bg-transparent text-brand-text cursor-pointer hover:bg-brand-primary/10 transition-colors" onClick={logout}>
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <NavLink to="/login" className="px-4 py-2 rounded-full border border-brand-line hover:bg-brand-primary/10 transition-colors text-[0.92rem]">
                    Sign in
                  </NavLink>
                  <NavLink to="/register" className="px-4 py-2 rounded-full border border-brand-line hover:bg-brand-primary/10 transition-colors text-[0.92rem]">
                    Register
                  </NavLink>
                </>
              )}
            </div>
          </header>
        </>
      ) : null}

      <main className={isAdminView ? "" : "max-w-[1180px] mx-auto p-8"}>
        <Outlet />
      </main>
    </div>
  );
}
