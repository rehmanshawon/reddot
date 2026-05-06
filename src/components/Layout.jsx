import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const navItems = [
  { label: "HOME", to: "/" },
  { label: "WORKS", to: "/works" },
  { label: "BTS", to: "/bts" },
  { label: "SERVICES", to: "/services" },
  { label: "TEAM", to: "/team" },
  { label: "ABOUT", to: "/about" },
  { label: "CONTACT", to: "/contact" },
];

export default function Layout() {
  const { isDark, toggle } = useTheme();
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <div className={`site-shell${isHome ? " site-shell--home" : ""}`}>
      <header className={`topbar${isHome ? " topbar--transparent" : ""}`}>
        <NavLink to="/" className="brandmark">
          <img
            src={isDark ? "/logo-light.png" : "/logo-dark.png"}
            alt="RED DOT"
            className="brandmark__logo"
          />
        </NavLink>

        <nav className="nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `nav__link${isActive ? " nav__link--active" : ""}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="topbar__actions">
          <button
            type="button"
            className="theme-toggle"
            onClick={toggle}
            aria-label={isDark ? "Switch to day mode" : "Switch to dark mode"}
          >
            {isDark ? "☀️" : "🌙"}
          </button>
        </div>
      </header>

      <main className="main-content">
        <Outlet />
      </main>

      <footer className="footer">
        <div>
          <img
            src={isDark ? "/logo-light.png" : "/logo-dark.png"}
            alt="RED DOT"
            className="footer__logo"
          />
          <p>ADVERTISING FILMS FOR TELEVISION, YOUTUBE, AND FACEBOOK.</p>
        </div>
        <div>
          <p>DHAKA, BANGLADESH</p>
          <p>HELLO@REDDOTFILMS.COM</p>
        </div>
      </footer>
    </div>
  );
}
