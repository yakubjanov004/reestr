import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  ArrowUpRight,
  Building2,
  CheckCircle2,
  Database,
  MapPin,
  ShieldCheck,
  TrendingUp,
  Upload,
  Users
} from "lucide-react";

import api from "../../api/client.js";
import {
  ROLE_MANAGER,
  ROLE_OPERATOR,
  ROLE_SUPERVISOR,
  roleLabel
} from "../../auth/roles.js";
import StatCard from "../../components/StatCard.jsx";
import { useI18n } from "../../localization/i18n.jsx";

/* ── Utilities ───────────────────────────────────────────────── */

const numberFormatter = new Intl.NumberFormat("de-DE");
const moneyFormatter = new Intl.NumberFormat("de-DE", { maximumFractionDigits: 0 });

function fmt(value) {
  return numberFormatter.format(Number(value || 0));
}

function fmtMoney(value, currency = "so'm") {
  return `${moneyFormatter.format(Number(value || 0))} ${currency}`;
}

function normalizeList(data) {
  return data?.results || data || [];
}

/* ── Component ───────────────────────────────────────────────── */

export default function ManagerWorkspacePage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const money = (value) => fmtMoney(value, t.kpi.currency);

  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [options, setOptions] = useState({ roles: [], regions: [], branches: [] });
  const [loading, setLoading] = useState(true);

  /* ── Data fetch ── */
  useEffect(() => {
    let active = true;
    setLoading(true);

    Promise.all([
      api.get("/records/stats/"),
      api.get("/operators/"),
      api.get("/organization/options/")
    ])
      .then(([statsRes, usersRes, optionsRes]) => {
        if (!active) return;
        setStats(statsRes.data);
        setUsers(normalizeList(usersRes.data));
        setOptions({
          roles: optionsRes.data.roles || [],
          regions: optionsRes.data.regions || [],
          branches: optionsRes.data.branches || []
        });
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, []);

  /* ── Derived data ── */
  const roleCounts = useMemo(
    () => users.reduce((acc, u) => { acc[u.role] = (acc[u.role] || 0) + 1; return acc; }, {}),
    [users]
  );

  const activeUsers = users.filter((u) => u.is_active).length;
  const operators = stats?.operators || [];
  const uploadedTodayCount = operators.filter((op) => (op.today_uploads || 0) > 0).length;
  const missingTodayCount = operators.filter((op) => op.is_active && (op.today_uploads || 0) === 0).length;
  const totalTodayRecords = operators.reduce((sum, op) => sum + (op.today_records || 0), 0);

  /* ── Region breakdown ── */
  const regionBreakdown = useMemo(() => {
    const regionMap = new Map();
    for (const region of options.regions) {
      regionMap.set(region.id, {
        id: region.id,
        name: region.name,
        branches: 0,
        operators: 0,
        activeOperators: 0,
        records: 0,
        todayRecords: 0
      });
    }
    for (const branch of options.branches) {
      const entry = regionMap.get(branch.region);
      if (entry) entry.branches += 1;
    }
    for (const op of operators) {
      const regionEntry = [...regionMap.values()].find((r) => r.name === op.region_name);
      if (regionEntry) {
        regionEntry.operators += 1;
        if (op.is_active) regionEntry.activeOperators += 1;
        regionEntry.records += op.records_count || 0;
        regionEntry.todayRecords += op.today_records || 0;
      }
    }
    return [...regionMap.values()].sort((a, b) => b.records - a.records);
  }, [options.regions, options.branches, operators]);

  /* ── Top performers ── */
  const topOperators = useMemo(() => {
    const ranking = stats?.operator_ranking || [];
    return ranking.slice(0, 5);
  }, [stats]);

  /* ── Loading skeleton ── */
  if (loading && !stats) {
    return (
      <div className="skeleton-wrapper">
        <div className="skeleton skeleton-title" style={{ width: "40%", marginBottom: "32px" }} />
        <div className="skeleton-grid-4">
          <div className="skeleton-card"><div className="skeleton skeleton-text" style={{ width: "40%" }} /><div className="skeleton skeleton-title" style={{ width: "80%", height: "32px", margin: 0 }} /></div>
          <div className="skeleton-card"><div className="skeleton skeleton-text" style={{ width: "40%" }} /><div className="skeleton skeleton-title" style={{ width: "80%", height: "32px", margin: 0 }} /></div>
          <div className="skeleton-card"><div className="skeleton skeleton-text" style={{ width: "40%" }} /><div className="skeleton skeleton-title" style={{ width: "80%", height: "32px", margin: 0 }} /></div>
          <div className="skeleton-card"><div className="skeleton skeleton-text" style={{ width: "40%" }} /><div className="skeleton skeleton-title" style={{ width: "80%", height: "32px", margin: 0 }} /></div>
        </div>
        <div className="skeleton-grid-2">
          <div className="skeleton-card" style={{ height: "300px" }} />
          <div className="skeleton-card" style={{ height: "300px" }} />
        </div>
      </div>
    );
  }

  const totalRecords = Number(stats?.total_records || 0);
  const totalUploads = Number(stats?.total_uploads || 0);
  const totalRevenue = Number(stats?.kpi?.total_amount || stats?.total_revenue || 0);

  return (
    <section className="page-stack mg-workspace-page">

      {/* ── Hero ── */}
      <div className="mg-workspace-hero">
        <div className="mg-workspace-hero-content">
          <div className="mg-workspace-hero-icon">
            <Building2 size={28} strokeWidth={1.5} />
          </div>
          <div>
            <h1>{t.management.managerTitle}</h1>
            <p>{t.management.managerDescription}</p>
          </div>
        </div>
        <span className="mg-workspace-scope-badge">{t.roles.manager}</span>
      </div>

      {/* ── Summary stats ── */}
      <div className="mg-workspace-stats-grid">
        <div className="mg-stat-card mg-stat-primary">
          <div className="mg-stat-icon"><Database size={20} /></div>
          <div className="mg-stat-body">
            <span className="mg-stat-value">{fmt(totalRecords)}</span>
            <span className="mg-stat-label">{t.dashboard.totalRecords}</span>
          </div>
        </div>

        <div className="mg-stat-card mg-stat-green">
          <div className="mg-stat-icon"><Upload size={20} /></div>
          <div className="mg-stat-body">
            <span className="mg-stat-value">{fmt(totalUploads)}</span>
            <span className="mg-stat-label">{t.dashboard.uploads}</span>
          </div>
        </div>

        <div className="mg-stat-card mg-stat-amber">
          <div className="mg-stat-icon"><Users size={20} /></div>
          <div className="mg-stat-body">
            <span className="mg-stat-value">{users.length}</span>
            <span className="mg-stat-label">{t.management.visibleUsers}</span>
          </div>
          <span className="mg-stat-sub">{activeUsers} {t.common.active.toLowerCase()}</span>
        </div>

        <div className="mg-stat-card mg-stat-teal">
          <div className="mg-stat-icon"><TrendingUp size={20} /></div>
          <div className="mg-stat-body">
            <span className="mg-stat-value">{money(totalRevenue)}</span>
            <span className="mg-stat-label">{t.managerWorkspace.totalRevenue}</span>
          </div>
        </div>
      </div>

      {/* ── Main grid ── */}
      <div className="mg-workspace-main-grid">

        {/* ── Left: Role breakdown + Region overview ── */}
        <div className="mg-workspace-left-col">

          {/* ── Role breakdown ── */}
          <section className="panel mg-workspace-panel">
            <div className="panel-heading">
              <h2>{t.management.usersByRole}</h2>
              <span className="panel-badge secondary">{activeUsers} {t.common.active.toLowerCase()}</span>
            </div>
            <div className="mg-role-grid">
              {[ROLE_SUPERVISOR, ROLE_OPERATOR].map((role) => (
                <div className="mg-role-card" key={role}>
                  <Users size={18} className="mg-role-icon" />
                  <div className="mg-role-body">
                    <strong>{roleCounts[role] || 0}</strong>
                    <span>{roleLabel(t, role)}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Region breakdown ── */}
          <section className="panel mg-workspace-panel">
            <div className="panel-heading">
              <h2>{t.management.organization}</h2>
              <button className="stats-panel-more" onClick={() => navigate("/operators")}>
                <ArrowUpRight size={17} />
              </button>
            </div>
            <div className="mg-region-list">
              {regionBreakdown.map((region) => (
                <div className="mg-region-row" key={region.id}>
                  <div className="mg-region-header">
                    <MapPin size={15} className="mg-region-icon" />
                    <strong className="mg-region-name">{region.name}</strong>
                    <span className="mg-region-badge">{region.branches} {t.common.branch.toLowerCase()}</span>
                  </div>
                  <div className="mg-region-stats">
                    <div className="mg-region-stat">
                      <Users size={13} />
                      <span>{region.activeOperators}/{region.operators}</span>
                    </div>
                    <div className="mg-region-stat">
                      <Database size={13} />
                      <span>{fmt(region.records)}</span>
                    </div>
                    <div className="mg-region-stat mg-region-stat-today">
                      <Activity size={13} />
                      <span>+{fmt(region.todayRecords)}</span>
                    </div>
                  </div>
                </div>
              ))}
              {regionBreakdown.length === 0 && (
                <p className="empty-state">{t.common.noData}</p>
              )}
            </div>
          </section>
        </div>

        {/* ── Right: Today activity + Top operators ── */}
        <div className="mg-workspace-right-col">

          {/* ── Today activity ── */}
          <section className="panel mg-workspace-panel">
            <div className="panel-heading">
              <h2>{t.monitoring.todayActivity}</h2>
            </div>
            <div className="mg-today-grid">
              <div className="mg-today-card mg-today-success">
                <CheckCircle2 size={18} />
                <div>
                  <strong>{uploadedTodayCount}</strong>
                  <span>{t.monitoring.uploadedToday}</span>
                </div>
              </div>
              <div className="mg-today-card mg-today-warning">
                <ShieldCheck size={18} />
                <div>
                  <strong>{missingTodayCount}</strong>
                  <span>{t.monitoring.missingToday}</span>
                </div>
              </div>
              <div className="mg-today-card mg-today-info">
                <Database size={18} />
                <div>
                  <strong>{fmt(totalTodayRecords)}</strong>
                  <span>{t.monitoring.todayImports}</span>
                </div>
              </div>
            </div>
            <button
              className="mg-monitoring-link"
              type="button"
              onClick={() => navigate("/supervisor-monitoring")}
            >
              <Activity size={15} />
              <span>{t.layout.nav.monitoring}</span>
              <ArrowUpRight size={15} />
            </button>
          </section>

          {/* ── Top operators ── */}
          <section className="panel mg-workspace-panel">
            <div className="panel-heading">
              <h2>{t.managerWorkspace.topOperators}</h2>
              <span className="panel-badge secondary">{t.dashboard.last30}</span>
            </div>
            <div className="mg-top-operators">
              {topOperators.map((op, index) => (
                <div className="mg-top-row" key={op.id}>
                  <span className="mg-top-rank">#{index + 1}</span>
                  <div className="mg-top-avatar">
                    {(op.full_name || op.username).charAt(0).toUpperCase()}
                  </div>
                  <div className="mg-top-identity">
                    <strong>{op.full_name || op.username}</strong>
                    <small>{fmt(op.records_count)} {t.common.recordsWord}</small>
                  </div>
                  <span className="mg-top-revenue">{money(op.total_revenue)}</span>
                </div>
              ))}
              {topOperators.length === 0 && (
                <p className="empty-state">{t.common.noData}</p>
              )}
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
