import { Link, NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  Sparkles,
  Store,
  X,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

const linkClass = ({ isActive }) =>
  `rounded-full px-3 py-2 text-sm font-semibold transition ${isActive ? "bg-white text-primary" : ""}`;

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const links = [
    ["/", "Home"],
    ["/search", "Search"],
    ["/promotions", "Promotions"],
    ...(user?.role === "owner" ? [["/dashboard", "Dashboard"]] : []),
  ];

  return (
    <header className="sticky top-0 z-40 bg-primary/95 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-3 text-lg font-bold">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-accent text-text">
            <Store size={22} />
          </span>
          <span>BizPromo</span>
        </Link>
        <button
          className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 md:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label="Open menu"
        >
          {open ? <X /> : <Menu />}
        </button>
        <div className="hidden items-center gap-2 md:flex">
          {links.map(([to, label]) => (
            <NavLink key={to} to={to} className={linkClass}>
              {label}
            </NavLink>
          ))}
          {isAuthenticated ? (
            <>
              {user?.role === "owner" && (
                <Link to="/dashboard" className="btn-accent">
                  <LayoutDashboard size={16} /> Owner Hub
                </Link>
              )}
              <button
                onClick={logout}
                className="rounded-xl border border-white/20 px-4 py-2 text-sm font-semibold transition hover:bg-white/10"
              >
                <LogOut size={16} className="mr-2 inline" /> Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="btn-accent">
              <Sparkles size={16} /> Login
            </Link>
          )}
        </div>
      </nav>
      {open && (
        <div className="space-y-2 border-t border-white/10 px-4 pb-4 md:hidden">
          {links.map(([to, label]) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `${linkClass({ isActive })} block`}
              onClick={() => setOpen(false)}
            >
              {label}
            </NavLink>
          ))}
          <Link to="/search" className="btn-accent w-full">
            <Search size={16} /> Find Businesses
          </Link>
          {isAuthenticated && (
            <button
              onClick={logout}
              className="w-full rounded-xl border border-white/20 px-4 py-3 text-sm font-semibold text-white"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
