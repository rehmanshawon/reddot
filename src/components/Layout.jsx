import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Works", to: "/works" },
  { label: "BTS", to: "/bts" },
  { label: "About", to: "/about" },
  { label: "Leadership", to: "/leadership" },
  { label: "Creative Team", to: "/team" },
];

export default function Layout() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <div className="site-shell">
      <div className="site-backdrop" aria-hidden="true" />
      <header className="topbar">
        <NavLink to="/" className="brandmark">
          <span className="brandmark__dot" />
          <span>
            <strong>Red Dot</strong>
            <small>Advertising Films</small>
          </span>
        </NavLink>

        <nav className="nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => (isActive ? "nav__link active" : "nav__link")}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="auth-actions">
          {isAuthenticated ? (
            <>
              <NavLink to="/admin" className="button button--ghost">
                Admin
              </NavLink>
              <button type="button" className="button button--solid" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <NavLink to="/login" className="button button--solid">
              Admin Login
            </NavLink>
          )}
        </div>
      </header>

      <main className="main-content">
        <Outlet />
      </main>

      <footer className="footer">
        <div>
          <p className="footer__brand">Red Dot</p>
          <p>Advertising films for television, YouTube, and Facebook.</p>
        </div>
        <div>
          <p>Dhaka, Bangladesh</p>
          <p>hello@reddotfilms.com</p>
        </div>
      </footer>
    </div>
  );
}
