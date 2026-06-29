import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  RefreshCw,
  Search,
  Upload,
  Users,
  XCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import api from "../../api/client.js";
import { useI18n } from "../../localization/i18n.jsx";
import SupervisorOperatorCard from "./SupervisorOperatorCard.jsx";
import SupervisorTimelinePanel from "./SupervisorTimelinePanel.jsx";

function formatTimeAgo(isoString, t) {
  if (!isoString) return t.monitoring.neverUploaded;
  const diff = Date.now() - new Date(isoString).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return t.monitoring.justNow;
  if (minutes < 60) return `${minutes} ${t.monitoring.minutesAgo}`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} ${t.monitoring.hoursAgo}`;
  const days = Math.floor(hours / 24);
  return `${days} ${t.monitoring.daysAgo}`;
}

function classifyOperator(operator) {
  if (!operator.is_active) return "blocked";
  if (operator.today_uploads > 0) return "active";
  if (!operator.last_upload_at) return "never";
  return "idle";
}

function statusLabel(status, t) {
  if (status === "active") return t.monitoring.uploadedToday;
  if (status === "idle") return t.monitoring.noUploadsToday;
  if (status === "never") return t.monitoring.neverUploaded;
  return t.common.blocked;
}

function statusIcon(status) {
  if (status === "active") return CheckCircle2;
  if (status === "idle") return Clock;
  if (status === "never") return AlertTriangle;
  return XCircle;
}

function uniqSorted(values) {
  return [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

function uniqueById(items) {
  const seen = new Set();
  return items.filter((item) => {
    const key = item?.id;
    if (key == null) return true;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function todayIsoDate() {
  const date = new Date();
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 10);
}

const numberFormatter = new Intl.NumberFormat("de-DE");
const OPERATOR_PAGE_SIZE = 6;

export default function SupervisorMonitoringPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all"); // all | active | missing
  const [search, setSearch] = useState("");
  const [regionFilter, setRegionFilter] = useState("");
  const [branchFilter, setBranchFilter] = useState("");
  const [operatorPage, setOperatorPage] = useState(1);

  const loadStats = useCallback(async ({ silent = false } = {}) => {
    if (silent) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError("");
    try {
      const response = await api.get("/records/stats/");
      setStats(response.data);
      setLastUpdated(new Date());
    } catch {
      setError(t.monitoring.loadError);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [t.monitoring.loadError]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const operators = useMemo(() => (
    uniqueById(stats?.operators || []).map((op) => ({
      ...op,
      status: classifyOperator(op),
      timeAgo: formatTimeAgo(op.last_upload_at, t)
    }))
  ), [stats, t]);

  const regionOptions = useMemo(
    () => uniqSorted(operators.map((op) => op.region_name)),
    [operators]
  );

  const branchOptions = useMemo(
    () => uniqSorted(
      operators
        .filter((op) => !regionFilter || op.region_name === regionFilter)
        .map((op) => op.branch_name)
    ),
    [operators, regionFilter]
  );

  const scopedOperators = useMemo(() => {
    const query = search.trim().toLowerCase();
    return operators.filter((op) => {
      if (regionFilter && op.region_name !== regionFilter) return false;
      if (branchFilter && op.branch_name !== branchFilter) return false;
      if (!query) return true;
      return [
        op.full_name,
        op.username,
        op.branch_name,
        op.region_name
      ].filter(Boolean).some((value) => value.toLowerCase().includes(query));
    });
  }, [operators, search, regionFilter, branchFilter]);

  const totalCount = scopedOperators.length;
  const activeCount = scopedOperators.filter((op) => op.is_active).length;
  const uploadedTodayCount = scopedOperators.filter((op) => op.status === "active").length;
  const missingTodayCount = scopedOperators.filter((op) => op.is_active && op.status !== "active").length;
  const totalTodayRecords = scopedOperators.reduce((sum, op) => sum + (op.today_records || 0), 0);
  const totalTodayUploads = scopedOperators.reduce((sum, op) => sum + (op.today_uploads || 0), 0);
  const uploadCompletion = activeCount > 0 ? Math.round((uploadedTodayCount / activeCount) * 100) : 0;

  const filteredOperators = scopedOperators.filter((op) => {
    if (statusFilter === "active") return op.status === "active";
    if (statusFilter === "missing") return op.is_active && op.status !== "active";
    return true;
  });
  const operatorPageCount = Math.max(1, Math.ceil(filteredOperators.length / OPERATOR_PAGE_SIZE));
  const operatorPageStart = (operatorPage - 1) * OPERATOR_PAGE_SIZE;
  const pagedOperators = filteredOperators.slice(operatorPageStart, operatorPageStart + OPERATOR_PAGE_SIZE);
  const operatorRangeStart = filteredOperators.length === 0 ? 0 : operatorPageStart + 1;
  const operatorRangeEnd = Math.min(operatorPageStart + pagedOperators.length, filteredOperators.length);

  useEffect(() => {
    setOperatorPage(1);
  }, [search, regionFilter, branchFilter, statusFilter]);

  useEffect(() => {
    setOperatorPage((current) => Math.min(current, operatorPageCount));
  }, [operatorPageCount]);

  const branchRows = useMemo(() => {
    const branchMap = new Map();
    for (const op of scopedOperators) {
      const key = op.branch_name || "—";
      if (!branchMap.has(key)) {
        branchMap.set(key, { branch: key, total: 0, uploaded: 0, records: 0 });
      }
      const entry = branchMap.get(key);
      entry.total += 1;
      if (op.status === "active") entry.uploaded += 1;
      entry.records += op.today_records || 0;
    }
    return [...branchMap.values()].sort((a, b) => b.records - a.records);
  }, [scopedOperators]);

  const recentBatches = uniqueById(stats?.recent_batches || []);
  const missingYesterday = uniqueById(stats?.upload_alerts?.missing_yesterday || []);
  const lastUpdatedText = lastUpdated
    ? lastUpdated.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", second: "2-digit" })
    : "—";

  function clearFilters() {
    setSearch("");
    setRegionFilter("");
    setBranchFilter("");
    setStatusFilter("all");
  }

  function changeRegion(value) {
    setRegionFilter(value);
    setBranchFilter("");
  }

  function openOperatorRecords(operator) {
    const params = new URLSearchParams({
      uploaded_by: String(operator.id),
      date_from: todayIsoDate(),
      date_to: todayIsoDate()
    });
    navigate(`/records?${params.toString()}`);
  }

  function openOperatorBatches(operator) {
    const params = new URLSearchParams({
      uploaded_by: String(operator.id),
      date_from: todayIsoDate(),
      date_to: todayIsoDate()
    });
    navigate(`/batches?${params.toString()}`);
  }

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

  return (
    <section className="page-stack sv-monitoring-page">
      <div className="sv-monitoring-hero">
        <div className="sv-monitoring-hero-content">
          <div className="sv-monitoring-hero-icon">
            <Activity size={26} strokeWidth={1.5} />
          </div>
          <div>
            <h1>{t.monitoring.title}</h1>
            <p>{t.monitoring.subtitle}</p>
          </div>
        </div>
        <div className="sv-monitoring-hero-actions">
          <span>{t.monitoring.lastUpdated}: {lastUpdatedText}</span>
          <button type="button" onClick={() => loadStats({ silent: true })} disabled={refreshing}>
            <RefreshCw size={16} className={refreshing ? "is-spinning" : ""} />
            {refreshing ? t.monitoring.refreshLoading : t.monitoring.refresh}
          </button>
        </div>
      </div>

      {error && (
        <div className="sv-monitoring-error" role="alert">
          <span>{error}</span>
          <button type="button" onClick={() => loadStats({ silent: true })}>
            {t.monitoring.refresh}
          </button>
        </div>
      )}

      <div className="panel sv-monitoring-toolbar">
        <label className="sv-monitoring-search">
          <Search size={17} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t.monitoring.searchPlaceholder}
          />
        </label>
        <label className="sv-monitoring-select">
          <span>{t.common.region}</span>
          <select value={regionFilter} onChange={(event) => changeRegion(event.target.value)}>
            <option value="">{t.common.all}</option>
            {regionOptions.map((region) => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
        </label>
        <label className="sv-monitoring-select">
          <span>{t.common.branch}</span>
          <select value={branchFilter} onChange={(event) => setBranchFilter(event.target.value)}>
            <option value="">{t.common.all}</option>
            {branchOptions.map((branch) => (
              <option key={branch} value={branch}>{branch}</option>
            ))}
          </select>
        </label>
        <button type="button" className="sv-monitoring-clear" onClick={clearFilters}>
          {t.common.clear}
        </button>
      </div>

      <div className="sv-monitoring-stats-grid">
        <button
          type="button"
          className={`sv-stat-card sv-stat-total ${statusFilter === "all" ? "sv-stat-active-filter" : ""}`}
          onClick={() => setStatusFilter("all")}
        >
          <div className="sv-stat-icon"><Users size={20} /></div>
          <div className="sv-stat-body">
            <span className="sv-stat-value">{totalCount}</span>
            <span className="sv-stat-label">{t.monitoring.allOperators}</span>
          </div>
          <span className="sv-stat-sub">{activeCount} {t.common.active.toLowerCase()}</span>
        </button>

        <button
          type="button"
          className={`sv-stat-card sv-stat-success ${statusFilter === "active" ? "sv-stat-active-filter" : ""}`}
          onClick={() => setStatusFilter("active")}
        >
          <div className="sv-stat-icon"><CheckCircle2 size={20} /></div>
          <div className="sv-stat-body">
            <span className="sv-stat-value">{uploadedTodayCount}</span>
            <span className="sv-stat-label">{t.monitoring.uploadedToday}</span>
          </div>
          <span className="sv-stat-sub">{uploadCompletion}% {t.monitoring.completionRate.toLowerCase()}</span>
        </button>

        <button
          type="button"
          className={`sv-stat-card sv-stat-warning ${statusFilter === "missing" ? "sv-stat-active-filter" : ""}`}
          onClick={() => setStatusFilter("missing")}
        >
          <div className="sv-stat-icon"><AlertTriangle size={20} /></div>
          <div className="sv-stat-body">
            <span className="sv-stat-value">{missingTodayCount}</span>
            <span className="sv-stat-label">{t.monitoring.missingToday}</span>
          </div>
        </button>
      </div>

      <div className="panel sv-daily-summary">
        <div className="sv-daily-summary-icon">
          <Upload size={18} />
        </div>
        <div className="sv-daily-summary-main">
          <span>{t.monitoring.todayResult}</span>
          <strong>{numberFormatter.format(totalTodayUploads)} {t.monitoring.todayUploads.toLowerCase()}</strong>
        </div>
        <div className="sv-daily-summary-metrics">
          <div>
            <span>{t.monitoring.todayImports}</span>
            <strong>{numberFormatter.format(totalTodayRecords)}</strong>
          </div>
          <div>
            <span>{t.monitoring.completionRate}</span>
            <strong>{uploadCompletion}%</strong>
          </div>
        </div>
      </div>

      <div className="sv-monitoring-main-grid">
        <section className="panel sv-monitoring-panel sv-operators-panel">
          <div className="panel-heading">
            <div>
              <h2>{t.monitoring.operatorStatus}</h2>
              <p className="sv-panel-caption">{t.monitoring.filteredOperators}</p>
            </div>
            <span className="panel-badge secondary">
              {operatorRangeStart}-{operatorRangeEnd} / {filteredOperators.length}
            </span>
          </div>

          <div className="sv-operator-cards-grid">
            {pagedOperators.length === 0 ? (
              <p className="empty-state sv-operator-empty-state">{t.monitoring.noOperators}</p>
            ) : (
              pagedOperators.map((op) => (
                <SupervisorOperatorCard
                  key={op.id}
                  operator={op}
                  statusLabel={statusLabel(op.status, t)}
                  StatusIcon={statusIcon(op.status)}
                  t={t}
                  onOpenRecords={openOperatorRecords}
                  onOpenBatches={openOperatorBatches}
                />
              ))
            )}
          </div>
          <div className="sv-operator-pagination">
            <span>
              {operatorRangeStart}-{operatorRangeEnd} / {filteredOperators.length}
            </span>
            <div>
              <button
                type="button"
                disabled={operatorPage <= 1}
                onClick={() => setOperatorPage((page) => Math.max(1, page - 1))}
              >
                {t.common.previous}
              </button>
              <button
                type="button"
                disabled={operatorPage >= operatorPageCount}
                onClick={() => setOperatorPage((page) => Math.min(operatorPageCount, page + 1))}
              >
                {t.common.next}
              </button>
            </div>
          </div>
        </section>

        <div className="sv-monitoring-sidebar">
          <SupervisorTimelinePanel batches={recentBatches} t={t} />

          <section className="panel sv-monitoring-panel sv-missing-panel">
            <div className="panel-heading">
              <h2>{t.monitoring.yesterdayMissing}</h2>
              <span className="panel-badge secondary">{missingYesterday.length}</span>
            </div>
            {missingYesterday.length === 0 ? (
              <p className="empty-state">{t.monitoring.yesterdayMissingEmpty}</p>
            ) : (
              <div className="sv-missing-list">
                {missingYesterday.map((operator) => (
                  <div className="sv-missing-row" key={operator.id}>
                    <span>{operator.full_name || operator.username}</span>
                    <small>{operator.username}</small>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="panel sv-monitoring-panel sv-branch-panel">
            <div className="panel-heading">
              <h2>{t.monitoring.branchBreakdown}</h2>
            </div>
            <div className="sv-branch-list">
              {branchRows.map((row) => (
                <div className="sv-branch-row" key={row.branch}>
                  <div className="sv-branch-name">{row.branch}</div>
                  <div className="sv-branch-stats">
                    <span className="sv-branch-stat-uploaded">
                      {row.uploaded}/{row.total}
                    </span>
                    <span className="sv-branch-stat-records">
                      {numberFormatter.format(row.records)} {t.common.recordsWord}
                    </span>
                  </div>
                  <div className="sv-branch-bar">
                    <div
                      className="sv-branch-bar-fill"
                      style={{ width: `${row.total > 0 ? (row.uploaded / row.total) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              ))}
              {branchRows.length === 0 && (
                <p className="empty-state">{t.common.noData}</p>
              )}
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
