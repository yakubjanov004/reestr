import { useEffect, useState } from "react";
import {
  Activity,
  ArrowUpRight,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  Database,
  Download,
  FileSpreadsheet,
  Gauge,
  MoreHorizontal,
  UploadCloud,
  Users
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import api from "../api/client.js";
import { useAuth } from "../auth/AuthContext.jsx";
import {
  ROLE_ADMIN,
  ROLE_MANAGER,
  ROLE_OPERATOR,
  ROLE_SUPERVISOR,
  canManageUsers,
  effectiveRole
} from "../auth/roles.js";
import { useI18n } from "../localization/i18n.jsx";
import { createDashboardModel } from "./dashboard/dashboardModel.js";
import { useDashboardData } from "./dashboard/useDashboardData.js";

const numberFormatter = new Intl.NumberFormat("de-DE");
const moneyFormatter = new Intl.NumberFormat("de-DE", {
  maximumFractionDigits: 0
});
const shortDateFormatter = new Intl.DateTimeFormat("uz-UZ", {
  day: "2-digit",
  month: "short"
});

const DASHBOARD_COPY = {
  [ROLE_OPERATOR]: {
    title: "Mening statistikam",
    intro: "Faqat siz yuklagan reestrlar, import holati va oxirgi faollik ko'rsatiladi.",
    scope: "Faqat o'zim"
  },
  [ROLE_SUPERVISOR]: {
    title: "Hudud operatorlari statistikasi",
    intro: "Sizga biriktirilgan hududdagi operatorlar importi, yuklashlari va faolligi ko'rsatiladi.",
    scope: "O'z hududim"
  },
  [ROLE_MANAGER]: {
    title: "Hududlar bo'yicha statistika",
    intro: "Barcha hududlar, filiallar, supervisor va operatorlar bo'yicha umumiy natijalarni kuzating.",
    scope: "Barcha hududlar"
  },
  [ROLE_ADMIN]: {
    title: "Umumiy tizim statistikasi",
    intro: "Manager, supervisor va operatorlar ishlayotgan barcha hududlar bo'yicha nazorat oynasi.",
    scope: "Admin ko'rinishi"
  }
};

const sourceColors = {
  mobile: "#2f6eea",
  internet: "#10b981",
  unknown: "#f59e0b"
};

function dashboardCopyFor(role) {
  return DASHBOARD_COPY[role] || DASHBOARD_COPY[ROLE_OPERATOR];
}

function formatNumber(value) {
  return numberFormatter.format(Number(value || 0));
}

function formatMoney(value) {
  return `${moneyFormatter.format(Number(value || 0))} so'm`;
}

function formatCompact(value) {
  const number = Number(value || 0);
  if (number >= 1_000_000_000) return `${Math.round(number / 1_000_000_000)} mlrd`;
  if (number >= 1_000_000) return `${Math.round(number / 1_000_000)} mln`;
  if (number >= 1_000) return `${Math.round(number / 1_000)} ming`;
  return formatNumber(number);
}

function dateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatShortDate(value) {
  if (!value) return "";
  return shortDateFormatter.format(new Date(value));
}

function buildRecentSeries(series, days) {
  const normalized = (series || [])
    .map((item) => ({
      key: String(item.date || "").slice(0, 10),
      count: Number(item.count || 0)
    }))
    .filter((item) => item.key);
  const counts = new Map(normalized.map((item) => [item.key, item.count]));
  const endDate = normalized.length
    ? new Date([...counts.keys()].sort().at(-1))
    : new Date();

  return Array.from({ length: days }, (_, index) => {
    const date = new Date(endDate);
    date.setDate(endDate.getDate() - (days - index - 1));
    const key = dateKey(date);
    return {
      key,
      label: formatShortDate(key),
      count: counts.get(key) || 0
    };
  });
}

function sourceLabel(t, sourceType) {
  if (sourceType === "mobile") return t.source?.mobile || "Mobil raqam";
  if (sourceType === "internet") return t.source?.internet || "Internet ulanish";
  return "Noma'lum";
}

function branchLabel(branch) {
  return branch.region_name ? `${branch.region_name} / ${branch.name}` : branch.name;
}

export default function DashboardPage() {
  const { t } = useI18n();
  const { user } = useAuth();
  const activeRole = effectiveRole(user);
  const copy = dashboardCopyFor(activeRole);
  const hasManagementAccess = canManageUsers(user);

  const [selectedOperatorId, setSelectedOperatorId] = useState("");
  const [organizationFilters, setOrganizationFilters] = useState({ assigned_region: "", assigned_branch: "" });
  const [filterOptions, setFilterOptions] = useState({ regions: [], branches: [] });
  const { stats, loading } = useDashboardData(selectedOperatorId, organizationFilters);

  useEffect(() => {
    if (!hasManagementAccess) return;
    api.get("/records/filter-options/").then((response) => {
      setFilterOptions({
        regions: response.data.organization_regions || [],
        branches: response.data.branches || []
      });
    });
  }, [hasManagementAccess]);

  if (loading && !stats) {
    return (
      <div className="skeleton-wrapper">
        <div className="skeleton skeleton-title" style={{ width: '30%', marginBottom: '32px' }} />
        
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

  const safeStats = stats || {};
  const model = createDashboardModel(safeStats);
  const kpi = safeStats.kpi || {};
  const totalRecords = Number(safeStats.total_records || 0);
  const totalUploads = Number(safeStats.total_uploads || 0);
  const importedThisMonth = Number(safeStats.imported_this_month || 0);
  const recordsLast7 = Number(safeStats.records_last_7 || 0);
  const activeOperators = Number(safeStats.active_operators || 0);
  const totalOperators = Number(safeStats.total_operators || 0);
  const totalRevenue = Number(kpi.total_amount || safeStats.total_revenue || 0);
  const successRate = Number(model.importSuccessRate || 0);
  const recentSeries = buildRecentSeries(model.daySeries || model.heatmapSeries, 14);
  const dotSeries = buildRecentSeries(model.daySeries || model.heatmapSeries, 30);
  const maxDotCount = Math.max(...dotSeries.map((item) => item.count), 1);
  const maxDotRows = 7;
  const sourceRows = (model.sourceSummary.length ? model.sourceSummary : [
    { sourceType: "mobile", records: 0, uploads: 0, revenue: 0 },
    { sourceType: "internet", records: 0, uploads: 0, revenue: 0 }
  ]).map((item) => ({
    ...item,
    label: sourceLabel(t, item.sourceType),
    color: sourceColors[item.sourceType] || sourceColors.unknown,
    records: Number(item.records || 0),
    uploads: Number(item.uploads || 0),
    revenue: Number(item.revenue || 0)
  }));
  const sourceRecordsTotal = sourceRows.reduce((sum, item) => sum + item.records, 0);
  const sourceChartData = sourceRows.map((item) => ({
    name: item.label,
    records: item.records,
    revenue: item.revenue,
    fill: item.color
  }));
  const dashboardBranchOptions = filterOptions.branches.filter(
    (branch) =>
      !organizationFilters.assigned_region
      || String(branch.region) === String(organizationFilters.assigned_region)
  );
  const insightTrend = recentSeries.slice(-7);
  const qualitySegments = [
    { label: "Import", value: model.totalImportedRows, color: "#2f6eea" },
    { label: "Dublikat", value: model.totalDuplicateRows, color: "#93c5fd" },
    { label: "O'tkazilgan", value: model.totalSkippedRows, color: "#e5e7eb" }
  ];
  const rankingRows = model.operatorRanking?.slice(0, 4) || [];

  return (
    <section className="page-stack dashboard-page stats-overview-page">
      <div className="dashboard-frame stats-overview-shell">
        <div className="help-hero-banner" style={{ minHeight: "180px", marginBottom: "24px", background: "radial-gradient(circle at 90% 14%, rgba(255, 255, 255, 0.15), transparent 40%), linear-gradient(135deg, #0d9488 0%, #2563eb 100%)", display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div className="help-hero-content">
            <span className="help-hero-badge"><Activity size={16}/> Tizim statistikasi &bull; {copy.scope}</span>
            <h1>Barcha ko'rsatkichlar bitta joyda</h1>
            <p>Tizimdagi umumiy holat, operatorlar faoliyati, yuklanmalar soni va savdo ko'rsatkichlarini real vaqt rejimida kuzatib boring.</p>
          </div>
          <div className="stats-head-actions" style={{ position: "relative", zIndex: 2, display: "flex", gap: "8px" }}>
            <button type="button" style={{ background: "rgba(255,255,255,0.2)", color: "#fff", border: "none", backdropFilter: "blur(4px)" }}>
              <Download size={16} />
              Eksport
            </button>
            <button type="button" aria-label="Ko'proq" style={{ background: "rgba(255,255,255,0.2)", color: "#fff", border: "none", backdropFilter: "blur(4px)" }}>
              <MoreHorizontal size={17} />
            </button>
          </div>
          <div className="help-hero-decoration">
            <div className="circle circle-1"></div>
            <div className="circle circle-2"></div>
            <div className="circle circle-3"></div>
          </div>
        </div>

        <div className="stats-toolbar">
          {hasManagementAccess && (
            <div className="stats-filter-row">
              <label>
                <span>Operator</span>
                <select
                  value={selectedOperatorId}
                  onChange={(event) => setSelectedOperatorId(event.target.value)}
                >
                  <option value="">{activeRole === ROLE_SUPERVISOR ? "Hudud operatorlari" : "Barcha operatorlar"}</option>
                  {(model.operators || []).map((operator) => (
                    <option key={operator.id} value={operator.id}>
                      {operator.full_name || operator.username}
                    </option>
                  ))}
                </select>
              </label>
              {filterOptions.regions.length > 0 && (
                <label>
                  <span>{t.common.region}</span>
                  <select
                    value={organizationFilters.assigned_region}
                    onChange={(event) => {
                      setSelectedOperatorId("");
                      setOrganizationFilters({
                        assigned_region: event.target.value,
                        assigned_branch: ""
                      });
                    }}
                  >
                    <option value="">{t.common.all}</option>
                    {filterOptions.regions.map((region) => (
                      <option key={region.id} value={region.id}>{region.name}</option>
                    ))}
                  </select>
                </label>
              )}
              {filterOptions.branches.length > 0 && (
                <label>
                  <span>{t.common.branch}</span>
                  <select
                    value={organizationFilters.assigned_branch}
                    onChange={(event) => {
                      setSelectedOperatorId("");
                      setOrganizationFilters((current) => ({
                        ...current,
                        assigned_branch: event.target.value
                      }));
                    }}
                  >
                    <option value="">{t.common.all}</option>
                    {dashboardBranchOptions.map((branch) => (
                      <option key={branch.id} value={branch.id}>{branchLabel(branch)}</option>
                    ))}
                  </select>
                </label>
              )}
            </div>
          )}
        </div>

        <div className="stats-kpi-strip">
          <span>
            <Database size={16} />
            Reestr: {formatNumber(totalRecords)}
          </span>
          <span>
            <UploadCloud size={16} />
            Yuklash: {formatNumber(totalUploads)}
          </span>
          <span>
            <CalendarDays size={16} />
            Shu oy: {formatNumber(importedThisMonth)}
          </span>
          <span>
            <CheckCircle2 size={16} />
            Import: {formatNumber(model.totalImportedRows)}
          </span>
        </div>

        <div className="stats-overview-grid">
          <section className="stats-revenue-card">
            <div className="stats-card-top">
              <span>Jami reestr</span>
              <ArrowUpRight size={17} />
            </div>
            <strong>{formatNumber(totalRecords)}</strong>
            <p>Oxirgi 7 kun: {formatNumber(recordsLast7)} ta yozuv</p>
          </section>

          <section className="panel stats-insight-card">
            <div className="stats-card-top">
              <span>Jami summa</span>
              <ArrowUpRight size={17} />
            </div>
            <strong>{formatMoney(totalRevenue)}</strong>
            <div className="stats-mini-chart">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={insightTrend} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="statsInsightFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f472b6" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#f472b6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="#f43f8b"
                    strokeWidth={2.5}
                    fill="url(#statsInsightFill)"
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <p>{formatNumber(importedThisMonth)} ta yozuv shu oyda</p>
          </section>

          <section className="panel stats-balance-card">
            <div className="stats-card-top">
              <span>Import sifati</span>
              <Gauge size={17} />
            </div>
            <strong>{successRate}%</strong>
            <div className="stats-balance-track">
              {qualitySegments.map((item) => {
                const width = model.processedRows > 0 ? Math.max((item.value / model.processedRows) * 100, item.value ? 8 : 0) : 0;
                return (
                  <span
                    key={item.label}
                    style={{
                      width: `${width}%`,
                      background: item.color
                    }}
                  />
                );
              })}
            </div>
            <div className="stats-balance-legend">
              {qualitySegments.map((item) => (
                <span key={item.label}>
                  <i style={{ background: item.color }} />
                  {item.label}
                </span>
              ))}
            </div>
          </section>
        </div>

        <div className="stats-main-grid">
          <section className="panel stats-category-panel" style={{ "--gauge-rate": successRate }}>
            <div className="stats-panel-head">
              <div>
                <h2>Reestr kategoriyasi</h2>
                <p>Mobil va internet ulanishlar kesimi.</p>
              </div>
              <ArrowUpRight size={17} />
            </div>
            <div className="stats-categories-list">
              {sourceRows.map((item) => {
                const pct = sourceRecordsTotal > 0 ? (item.records / sourceRecordsTotal) * 100 : 0;
                return (
                  <div key={item.sourceType} className="stats-category-item">
                    <div className="stats-category-item-head">
                      <span>
                        <i style={{ background: item.color }} />
                        {item.label}
                      </span>
                      <strong>{formatNumber(item.records)} yozuv</strong>
                    </div>
                    <div className="stats-category-progress">
                      <div className="stats-category-progress-fill" style={{ width: `${pct}%`, background: item.color }} />
                    </div>
                    <div className="stats-category-item-foot">
                      {pct > 0 ? pct.toFixed(1) : 0}% ulush
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="stats-category-note">
              <span>+{formatNumber(recordsLast7)}</span>
              Oxirgi 7 kunda kiritilgan yozuv
            </div>
          </section>

          <section className="panel stats-summary-panel github-style-panel">
            <div className="stats-panel-head">
              <div>
                <h2>Reestr dinamikasi</h2>
              </div>
            </div>

            <div className="github-stats-row">
              <div className="github-stat">
                <span className="github-stat-label">Jami yozuvlar</span>
                <span className="github-stat-value">{formatNumber(dotSeries.reduce((a,b)=>a+b.count, 0))} <small style={{color: '#ef4444'}}>📉</small></span>
              </div>
              <div className="github-stat">
                <span className="github-stat-label">Max yuklash</span>
                <span className="github-stat-value">{formatNumber(maxDotCount)} <small style={{color: '#22c55e'}}>📈</small></span>
              </div>
              <div className="github-stat">
                <span className="github-stat-label">Faol kunlar</span>
                <span className="github-stat-value">{dotSeries.filter(d=>d.count>0).length} <small style={{color: '#22c55e'}}>📈</small></span>
              </div>
            </div>

            <div className="stats-contribution-chart">
              <div className="stats-contribution-body">
                <div className="stats-contribution-days">
                  <span>Dush</span>
                  <span>Chor</span>
                  <span>Juma</span>
                </div>
                <div className="stats-contribution-grid">
                  {(() => {
                    const firstDate = new Date(dotSeries[0]?.key || new Date());
                    const startDay = firstDate.getDay();
                    const offset = startDay === 0 ? 6 : startDay - 1;
                    const paddedSeries = [
                      ...Array.from({ length: offset }, () => null),
                      ...dotSeries
                    ];
                    
                    return paddedSeries.map((item, index) => {
                      if (!item) return <div key={`empty-${index}`} className="stats-contribution-cell empty" />;
                      
                      let level = 0;
                      if (item.count > 0) {
                        const ratio = item.count / maxDotCount;
                        if (ratio > 0.75) level = 4;
                        else if (ratio > 0.5) level = 3;
                        else if (ratio > 0.25) level = 2;
                        else level = 1;
                      }
                      
                      return (
                        <div 
                          key={item.key} 
                          className={`stats-contribution-cell level-${level}`}
                          title={`${item.label}: ${formatNumber(item.count)} ta yozuv`}
                        />
                      );
                    });
                  })()}
                </div>
              </div>
              <div className="stats-contribution-legend">
                <span>Kam</span>
                <div className="stats-contribution-cell level-0" />
                <div className="stats-contribution-cell level-1" />
                <div className="stats-contribution-cell level-2" />
                <div className="stats-contribution-cell level-3" />
                <div className="stats-contribution-cell level-4" />
                <span>Ko'p</span>
              </div>
            </div>
          </section>
        </div>

        <div className="stats-bottom-grid">
          <section className="panel stats-chart-panel">
            <div className="stats-panel-head">
              <div>
                <h2>Manba kesimi</h2>
                <p>Yozuv va summa manba bo'yicha taqsimlanadi.</p>
              </div>
              <BarChart3 size={17} />
            </div>
            <div className="stats-source-chart">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sourceChartData} margin={{ top: 12, right: 8, left: -12, bottom: 0 }}>
                  <CartesianGrid stroke="#e8eef6" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: "#8a95a8", fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fill: "#8a95a8", fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={formatCompact} />
                  <Tooltip
                    cursor={{ fill: "rgba(47, 110, 234, 0.05)" }}
                    contentStyle={{ border: 0, borderRadius: 12, boxShadow: "0 10px 24px rgba(15, 35, 70, 0.10)" }}
                    formatter={(value, name) => [name === "revenue" ? formatMoney(value) : `${formatNumber(value)} ta`, name === "revenue" ? "Summa" : "Yozuv"]}
                  />
                  <Bar dataKey="records" radius={[10, 10, 4, 4]} maxBarSize={60}>
                    {sourceChartData.map((entry) => (
                      <Cell key={entry.name} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="panel stats-list-panel">
            <div className="stats-panel-head">
              <div>
                <h2>{hasManagementAccess ? "Operatorlar" : "Mening yuklashlarim"}</h2>
                <p>{hasManagementAccess ? "Reyting va faol operatorlar." : "Shaxsiy import holati."}</p>
              </div>
              <Users size={17} />
            </div>

            <div className="stats-side-list">
              {hasManagementAccess && rankingRows.length > 0 ? rankingRows.map((operator, index) => (
                <div className="stats-list-row" key={operator.id}>
                  <span className="stats-row-index">{index + 1}</span>
                  <div>
                    <span>{operator.full_name || operator.username}</span>
                    <small>{formatNumber(operator.uploads_count)} yuklash - {formatNumber(operator.records_count)} yozuv</small>
                  </div>
                  <strong>{formatMoney(operator.total_revenue)}</strong>
                </div>
              )) : (
                <>
                  <div className="stats-list-row">
                    <span className="stats-row-icon"><FileSpreadsheet size={16} /></span>
                    <div>
                      <span>Jami yuklash</span>
                      <small>Excel importlar soni</small>
                    </div>
                    <strong>{formatNumber(totalUploads)}</strong>
                  </div>
                  <div className="stats-list-row">
                    <span className="stats-row-icon"><CheckCircle2 size={16} /></span>
                    <div>
                      <span>Import qilingan</span>
                      <small>Qabul qilingan qatorlar</small>
                    </div>
                    <strong>{formatNumber(model.totalImportedRows)}</strong>
                  </div>
                </>
              )}

              {hasManagementAccess && (
                <div className="stats-list-row muted">
                  <span className="stats-row-icon"><Activity size={16} /></span>
                  <div>
                    <span>Aktiv operatorlar</span>
                    <small>Jami operator: {formatNumber(totalOperators)}</small>
                  </div>
                  <strong>{formatNumber(activeOperators)}</strong>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
