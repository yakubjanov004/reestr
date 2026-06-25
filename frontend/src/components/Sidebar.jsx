import {
  LogOut,
  UserRound,
  X
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

import { useAuth } from "../auth/AuthContext.jsx";
import { isOperator, roleLongLabel } from "../auth/roles.js";
import { useI18n } from "../localization/i18n.jsx";
import { buildBottomLinks, buildSidebarSections } from "../navigation/roleNavigation.js";

export default function Sidebar({ mobileOpen = false, onClose = () => {} }) {
  const { logout, user } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();
  const operatorSession = isOperator(user);
  const visibleSections = buildSidebarSections(t, user);
  const bottomLinks = buildBottomLinks(t);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  function openProfile() {
    navigate("/profile");
    onClose();
  }

  function navLinkClass(item, isActive) {
    if (isActive || (operatorSession && item.to === "/upload")) {
      return "active";
    }
    return undefined;
  }

  return (
    <aside className={`sidebar ${mobileOpen ? "open" : ""}`}>
      <div className="brand">
        <img className="brand-logo" src="/logo.svg" alt="Datan Logo" />
        <button className="mobile-close" aria-label={t.common.close} onClick={onClose}>
          <X size={16} />
        </button>
      </div>

      <nav>
        {visibleSections.map((section) => (
          <div
            className={
              "nav-section" + (["supervision", "management", "admin"].includes(section.key) ? " manager-section" : "")
            }
            key={section.key}
          >
            <p className="nav-section-title">
              {section.title}
            </p>
            {section.links.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  title={item.label}
                  onClick={onClose}
                  className={({ isActive }) => navLinkClass(item, isActive)}
                >
                  <Icon size={20} strokeWidth={1.5} />
                  <span className="nav-label-full">{item.label}</span>
                  <span className="nav-label-short">{item.mobileLabel}</span>
                </NavLink>
              );
            })}
          </div>
        ))}
        
        <div className="nav-section" style={{ marginTop: 'auto' }}>
          {bottomLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                title={item.label}
                onClick={onClose}
                className={({ isActive }) => navLinkClass(item, isActive)}
              >
                <Icon size={20} strokeWidth={1.5} />
                <span className="nav-label-full">{item.label}</span>
                <span className="nav-label-short">{item.mobileLabel}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>

      <div className="sidebar-footer">
        <button
          className="user-summary profile-summary"
          type="button"
          onClick={openProfile}
          title={t.layout.profile}
        >
          <span className="user-summary-text">
            <strong>{user?.full_name || user?.username}</strong>
            <small>{roleLongLabel(t, user)}</small>
          </span>
          <UserRound className="profile-summary-icon" size={18} strokeWidth={1.5} />
        </button>
        <button className="logout-button" type="button" onClick={handleLogout} title={t.layout.logout}>
          <LogOut size={20} strokeWidth={1.5} />
          <span>{t.layout.logoutFull}</span>
        </button>
      </div>
    </aside>
  );
}
