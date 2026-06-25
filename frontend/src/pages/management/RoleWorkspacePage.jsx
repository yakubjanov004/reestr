import { useEffect, useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import { Building2, Database, History, ScrollText, ShieldCheck, Upload, Users } from "lucide-react";

import api from "../../api/client.js";
import {
  ROLE_ADMIN,
  ROLE_MANAGER,
  ROLE_OPERATOR,
  ROLE_SUPERVISOR,
  roleLabel
} from "../../auth/roles.js";
import StatCard from "../../components/StatCard.jsx";
import { useI18n } from "../../localization/i18n.jsx";

function normalizeList(data) {
  return data?.results || data || [];
}

export default function RoleWorkspacePage({ mode = "manager" }) {
  const { t } = useI18n();
  const isAdminMode = mode === "admin";
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [options, setOptions] = useState({ roles: [], regions: [], branches: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);

    Promise.all([
      api.get("/records/stats/"),
      api.get("/operators/"),
      api.get("/organization/options/")
    ])
      .then(([statsResponse, usersResponse, optionsResponse]) => {
        if (!active) return;
        setStats(statsResponse.data);
        setUsers(normalizeList(usersResponse.data));
        setUserCount(usersResponse.data.count ?? normalizeList(usersResponse.data).length);
        setOptions({
          roles: optionsResponse.data.roles || [],
          regions: optionsResponse.data.regions || [],
          branches: optionsResponse.data.branches || []
        });
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const roleCounts = useMemo(
    () =>
      users.reduce((acc, user) => {
        acc[user.role] = (acc[user.role] || 0) + 1;
        return acc;
      }, {}),
    [users]
  );

  const visibleRoles = isAdminMode
    ? [ROLE_ADMIN, ROLE_MANAGER, ROLE_SUPERVISOR, ROLE_OPERATOR]
    : [ROLE_SUPERVISOR, ROLE_OPERATOR];
  const activeUsers = users.filter((item) => item.is_active).length;
  const title = isAdminMode ? t.management.adminTitle : t.management.managerTitle;
  const description = isAdminMode ? t.management.adminDescription : t.management.managerDescription;
  const scopeLabel = isAdminMode ? t.roles.admin : t.roles.manager;
  const summaryCards = [
    { label: t.dashboard.totalRecords, value: stats?.total_records || 0, icon: Database, tone: "teal" },
    { label: t.dashboard.uploads, value: stats?.total_uploads || 0, icon: Upload, tone: "green" },
    { label: t.management.visibleUsers, value: userCount, icon: Users, tone: "amber" },
    { label: t.common.active, value: activeUsers, icon: ShieldCheck, tone: "teal" }
  ];
  const quickLinks = [
    { to: "/operators", label: t.layout.nav.operators, icon: Users },
    { to: "/records", label: t.layout.nav.records, icon: Database },
    { to: "/batches", label: t.layout.nav.batches, icon: History },
    { to: "/audit", label: t.layout.nav.audit, icon: ScrollText }
  ];

  if (loading && !stats) {
    return (
      <div className="skeleton-wrapper">
        <div className="skeleton skeleton-title" style={{ width: '40%', marginBottom: '32px' }} />
        
        <div className="skeleton-grid-4">
          <div className="skeleton-card"><div className="skeleton skeleton-text" style={{ width: '40%' }}/><div className="skeleton skeleton-title" style={{ width: '80%', height: '32px', margin: 0 }}/></div>
          <div className="skeleton-card"><div className="skeleton skeleton-text" style={{ width: '40%' }}/><div className="skeleton skeleton-title" style={{ width: '80%', height: '32px', margin: 0 }}/></div>
          <div className="skeleton-card"><div className="skeleton skeleton-text" style={{ width: '40%' }}/><div className="skeleton skeleton-title" style={{ width: '80%', height: '32px', margin: 0 }}/></div>
          <div className="skeleton-card"><div className="skeleton skeleton-text" style={{ width: '40%' }}/><div className="skeleton skeleton-title" style={{ width: '80%', height: '32px', margin: 0 }}/></div>
        </div>

        <div className="skeleton-grid-2">
          <div className="skeleton-card" style={{ height: '300px' }} />
          <div className="skeleton-card" style={{ height: '300px' }} />
        </div>
      </div>
    );
  }

  return (
    <section className={`page-stack role-workspace role-workspace-${mode}`}>
      <header className="workspace-header">
        <div className="workspace-header-main">
          <span className="workspace-header-icon">
            {isAdminMode ? <ShieldCheck size={21} /> : <Building2 size={21} />}
          </span>
          <div>
            <span className="section-kicker">{t.management.heroKicker}</span>
            <h1>{title}</h1>
            <p>{description}</p>
          </div>
        </div>
        <span className="workspace-scope-badge">{scopeLabel}</span>
      </header>

      <div className="workspace-summary-grid">
        {summaryCards.map((card) => (
          <StatCard
            key={card.label}
            label={card.label}
            value={card.value}
            icon={card.icon}
            tone={card.tone}
          />
        ))}
      </div>

      <div className="workspace-grid">
        <section className="panel workspace-panel">
          <div className="panel-heading">
            <h2>{t.management.usersByRole}</h2>
            <span className="panel-badge secondary">{activeUsers} {t.common.active}</span>
          </div>
          <div className="workspace-role-grid">
            {visibleRoles.map((role) => (
              <StatCard
                key={role}
                label={roleLabel(t, role)}
                value={roleCounts[role] || 0}
                icon={role === ROLE_ADMIN ? ShieldCheck : Users}
                tone={role === ROLE_ADMIN ? "amber" : role === ROLE_OPERATOR ? "green" : "teal"}
              />
            ))}
          </div>
        </section>

        <section className="panel workspace-panel">
          <div className="panel-heading">
            <h2>{t.management.organization}</h2>
          </div>
          <div className="workspace-organization">
            <StatCard label={t.common.region} value={options.regions.length} icon={Building2} />
            <StatCard label={t.common.branch} value={options.branches.length} icon={Database} />
          </div>
          <div className="workspace-region-list">
            {options.regions.map((region) => {
              const branchCount = options.branches.filter(
                (branch) => String(branch.region) === String(region.id)
              ).length;
              return (
                <div className="workspace-region-row" key={region.id}>
                  <span>{region.name}</span>
                  <strong>{branchCount} {t.common.branch}</strong>
                </div>
              );
            })}
            {options.regions.length === 0 && (
              <p className="empty-state">{t.common.noData}</p>
            )}
          </div>
        </section>

        <section className="panel workspace-panel workspace-panel-wide">
          <div className="panel-heading">
            <h2>{t.management.quickLinks}</h2>
          </div>
          <div className="workspace-actions">
            {quickLinks.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink className="workspace-action" to={item.to} key={item.to}>
                  <Icon size={18} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        </section>
      </div>
    </section>
  );
}
