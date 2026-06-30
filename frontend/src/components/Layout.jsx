import { LogOut, Menu, UserRound } from "lucide-react";
import { Outlet, useNavigate } from "react-router-dom";

import { useAuth } from "../auth/AuthContext.jsx";
import { panelTitle, roleLabel } from "../auth/roles.js";
import Sidebar from "./Sidebar.jsx";
import { useState } from "react";
import { useI18n } from "../localization/i18n.jsx";

export default function Layout() {
  const { user, logout } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="app-shell">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <main className="main-content">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="mobile-hamburger"
              aria-label={t.layout.menu}
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={18} />
            </button>
            <div>
              <img className="topbar-logo" src="/favicon.svg" alt="Datan" />
              <h1>{panelTitle(t, user)}</h1>
            </div>
          </div>
          <div className="user-chip">
            <span>{user?.full_name || user?.username}</span>
            <strong>{roleLabel(t, user?.role)}</strong>
            <button
              className="chip-profile-button"
              type="button"
              onClick={() => navigate("/profile")}
              title={t.layout.profile}
              aria-label={t.layout.profile}
            >
              <UserRound size={16} />
            </button>
            <button
              className="mobile-logout"
              type="button"
              onClick={logout}
              title={t.layout.logout}
              aria-label={t.layout.logout}
            >
              <LogOut size={17} />
            </button>
          </div>
        </header>
        {mobileOpen && <div className="drawer-backdrop" onClick={() => setMobileOpen(false)} />}
        <Outlet />
      </main>
    </div>
  );
}
