import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const navItems = [
  { to: "/products", label: "Products" },
  { to: "/recommendations", label: "Recommendations" },
  { to: "/wishlist", label: "Wishlist" },
  { to: "/cart", label: "Cart" },
  { to: "/orders", label: "Orders" }
];

export default function Layout() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <div className="app-shell">
      <div className="announcement-bar">
        New season storefront demo connected to your personalized recommendation backend
      </div>

      <header className="topbar">
        <div className="brand-lockup">
          <span className="brand-mark">FS</span>
          <div>
            <h1>FashionStore</h1>
            <p>Routine-inspired modern fashion shopping experience</p>
          </div>
        </div>

        <nav className="nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="auth-box">
          {isAuthenticated ? (
            <>
              <div className="account-pill">
                <span className="account-label">Signed in as</span>
                <strong>{user?.full_name || user?.username}</strong>
              </div>
              <button className="ghost-button" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="nav-link">
                Login
              </NavLink>
              <NavLink to="/register" className="nav-link">
                Register
              </NavLink>
            </>
          )}
        </div>
      </header>

      <main className="page-wrap">
        <Outlet />
      </main>
    </div>
  );
}
