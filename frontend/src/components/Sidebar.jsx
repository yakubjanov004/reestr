import {
  Database,
  BookOpenText,
  ChartNoAxesColumn,
  History,
  LayoutGrid,
  LogOut,
  ScrollText,
  ShieldCheck,
  UserRound,
  Users,
  X,
  Settings,
  Info
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
        { to: "/upload", label: t.layout.nav.upload, mobileLabel: t.layout.nav.uploadShort, icon: LayoutGrid }
      ]
    },
    {
      key: "data",
      title: t.layout.sections.data,
      links: [
        { to: "/dashboard", label: t.layout.nav.dashboard, mobileLabel: t.layout.nav.dashboard, icon: ChartNoAxesColumn },
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

  const bottomLinks = [
    { to: "/settings", label: "Sozlamalar", mobileLabel: "Sozlamalar", icon: Settings },
    { to: "/help", label: "Yordam", mobileLabel: "Yordam", icon: Info }
  ];

  function handleLogout() {
    logout();
    navigate("/login");
  }

  function openProfile() {
    navigate("/profile");
    onClose();
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
                <NavLink key={item.to} to={item.to} end={item.to === "/"} title={item.label} onClick={onClose}>
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
              <NavLink key={item.to} to={item.to} end={item.to === "/"} title={item.label} onClick={onClose}>
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
            <small>{user?.role === "manager" ? t.roles.managerLong : t.roles.operator}</small>
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
