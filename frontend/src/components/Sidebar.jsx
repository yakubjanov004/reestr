import {
  LogOut,
  UserRound,
  X
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

import { useAuth } from "../auth/AuthContext.jsx";
import { effectiveRole, roleLongLabel } from "../auth/roles.js";
import { useI18n } from "../localization/i18n.jsx";
import { buildBottomLinks, buildSidebarSections, buildTopLinks } from "../navigation/roleNavigation.js";

export default function Sidebar({ mobileOpen = false, onClose = () => {} }) {
  const { logout, user } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();
  const currentRole = effectiveRole(user) || "operator";
  const visibleSections = buildSidebarSections(t, user);
  const bottomLinks = buildBottomLinks(t);
  const topLinks = buildTopLinks(t);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  function openProfile() {
    navigate("/profile");
    onClose();
  }

  function navLinkClass(item, isActive) {
    if (isActive) {
      return "active";
    }
    return undefined;
  }

  function linkClass(item, isActive, extraClass) {
    return [navLinkClass(item, isActive), extraClass].filter(Boolean).join(" ") || undefined;
  }

  function linkSlug(item) {
    return String(item.to || "link")
      .replace(/^\/+/, "")
      .replace(/[^a-z0-9]+/gi, "-")
      .replace(/^-|-$/g, "") || "home";
  }

  function renderDesktopLink(item) {
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
  }

  function renderMobileLink(item) {
    const Icon = item.icon;
    const label = item.mobileLabel || item.label;
    return (
      <NavLink
        key={item.to}
        to={item.to}
        end={item.to === "/"}
        title={item.label}
        onClick={onClose}
        className={({ isActive }) => linkClass(item, isActive, `mobile-nav-link mobile-nav-link-${linkSlug(item)}`)}
      >
        <Icon size={19} strokeWidth={1.8} />
        <span className="mobile-nav-label">{label}</span>
      </NavLink>
    );
  }

  return (
    <aside className={`sidebar sidebar-role-${currentRole} ${mobileOpen ? "open" : ""}`}>
      <div className="brand">
        <img className="brand-logo" src="/logo.svg" alt="Datan Logo" />
        <button className="mobile-close" aria-label={t.common.close} onClick={onClose}>
          <X size={16} />
        </button>
      </div>

      <nav className="sidebar-desktop-nav">
        {topLinks && topLinks.length > 0 && (
          <div className="nav-section">
            {topLinks.map(renderDesktopLink)}
          </div>
        )}

        {visibleSections.map((section) => (
          <div
            className={
              "nav-section" + (["supervisor_panel", "manager_panel", "admin_panel"].includes(section.key) ? " manager-section" : "")
            }
            key={section.key}
          >
            <p className="nav-section-title">
              {section.title}
            </p>
            {section.links.map(renderDesktopLink)}
          </div>
        ))}
        
        {bottomLinks && bottomLinks.length > 0 && (
          <div className="nav-section nav-section-utility">
            {bottomLinks.map(renderDesktopLink)}
          </div>
        )}
      </nav>

      <div className="sidebar-mobile-panel">
        <button
          className="mobile-profile-card"
          type="button"
          onClick={openProfile}
          title={t.layout.profile}
        >
          <span className="mobile-profile-icon">
            <UserRound size={19} strokeWidth={1.8} />
          </span>
          <span className="mobile-profile-copy">
            <strong>{user?.full_name || user?.username}</strong>
            <small>{roleLongLabel(t, user)}</small>
          </span>
        </button>

        <div className="mobile-nav-sections">
          {topLinks && topLinks.length > 0 && (
            <div className="mobile-nav-section">
              <div className="mobile-nav-grid">
                {topLinks.map(renderMobileLink)}
              </div>
            </div>
          )}

          {visibleSections.map((section) => (
            <section className={`mobile-nav-section mobile-nav-section-${section.key}`} key={section.key}>
              <p className="mobile-nav-section-title">{section.title}</p>
              <div className="mobile-nav-grid">
                {section.links.map(renderMobileLink)}
              </div>
            </section>
          ))}
        </div>

        <div className="mobile-sidebar-bottom">
          {bottomLinks && bottomLinks.length > 0 && (
            <div className="mobile-utility-grid">
              {bottomLinks.map(renderMobileLink)}
            </div>
          )}
          <button className="mobile-sidebar-logout" type="button" onClick={handleLogout} title={t.layout.logout}>
            <LogOut size={19} strokeWidth={1.8} />
            <span>{t.layout.logoutFull}</span>
          </button>
        </div>
      </div>

      <div className="sidebar-footer sidebar-desktop-footer">
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
