import {
  Database,
  BookOpenText,
  History,
  LayoutDashboard,
  LogOut,
  ScrollText,
  ShieldCheck,
  Signal,
  Upload,
  UserRound,
  Users,
  X
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

import { useAuth } from "../auth/AuthContext.jsx";
import { useI18n } from "../localization/i18n.jsx";

export default function Sidebar({ mobileOpen = false, onClose = () => {} }) {
  const { logout, user } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();
  const sections = [
    {
      key: "operations",
      title: t.layout.sections.operations,
      links: [
        { to: "/dashboard", label: t.layout.nav.dashboard, mobileLabel: t.layout.nav.dashboard, icon: LayoutDashboard },
        { to: "/upload", label: t.layout.nav.upload, mobileLabel: t.layout.nav.uploadShort, icon: Upload }
      ]
    },
    {
      key: "data",
      title: t.layout.sections.data,
      links: [
        { to: "/records", label: t.layout.nav.records, mobileLabel: t.layout.nav.recordsShort, icon: Database },
        { to: "/batches", label: t.layout.nav.batches, mobileLabel: t.layout.nav.batchesShort, icon: History },
        { to: "/privacy", label: t.layout.nav.privacy, mobileLabel: t.layout.nav.privacyShort, icon: ShieldCheck },
        { to: "/guide", label: t.layout.nav.guide, mobileLabel: t.layout.nav.guideShort, icon: BookOpenText }
      ]
    }
  ];
  const managerSection = {
    key: "system",
    title: t.layout.sections.system,
    links: [
      { to: "/operators", label: t.layout.nav.operators, mobileLabel: t.layout.nav.operatorsShort, icon: Users },
      { to: "/audit", label: t.layout.nav.audit, mobileLabel: t.layout.nav.audit, icon: ScrollText }
    ]
  };
  const visibleSections =
    user?.role === "manager" ? [...sections, managerSection] : sections;

  function handleLogout() {
    logout();
    navigate("/login");
  }

  function openProfile() {
    navigate("/profile");
    onClose();
  }

  return (
    <aside className={`sidebar ${mobileOpen ? "open" : ""}`} aria-hidden={!mobileOpen && undefined}>
      <div className="brand">
        <span className="brand-mark">
          <Signal size={16} />
        </span>
        <span className="brand-text">
          Reestr<span className="brand-accent">Telecom</span>
        </span>
        <button className="mobile-close" aria-label={t.common.close} onClick={onClose}>
          <X size={16} />
        </button>
      </div>

      <nav>
        {visibleSections.map((section) => (
          <div
            className={
              "nav-section" + (section.key === "system" ? " manager-section" : "")
            }
            key={section.key}
          >
            <p className="nav-section-title">
              {section.title}
            </p>
            {section.links.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink key={item.to} to={item.to} end={item.to === "/"} title={item.label}>
                  <Icon size={18} />
                  <span className="nav-label-full">{item.label}</span>
                  <span className="nav-label-short">{item.mobileLabel}</span>
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button
          className="user-summary profile-summary"
          type="button"
          onClick={openProfile}
          title={t.layout.profile}
        >
          <span className="user-avatar">
            {(user?.full_name || user?.username || "?").charAt(0).toUpperCase()}
          </span>
          <span className="user-summary-text">
            <strong>{user?.full_name || user?.username}</strong>
            <small>{user?.role === "manager" ? t.roles.managerLong : t.roles.operator}</small>
          </span>
          <UserRound className="profile-summary-icon" size={15} />
        </button>
        <button className="logout-button" type="button" onClick={handleLogout} title={t.layout.logout}>
          <LogOut size={16} />
          <span>{t.layout.logoutFull}</span>
        </button>
      </div>
    </aside>
  );
}
