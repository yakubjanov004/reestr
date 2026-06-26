import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  LabelList,
  Pie,
  PieChart,
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

function dashboardHeroFor(role, copy) {
  if (role === ROLE_ADMIN) {
    return {
      title: "Barcha ko'rsatkichlar bitta joyda",
      intro: "Tizimdagi umumiy holat, operatorlar faoliyati, yuklanmalar soni va savdo ko'rsatkichlarini real vaqt rejimida kuzatib boring."
    };
  }

  return {
    title: copy.title,
    intro: copy.intro
  };
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
  const endDate = new Date();

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
  const navigate = useNavigate();
  const activeRole = effectiveRole(user);
  const copy = dashboardCopyFor(activeRole);
  const hero = dashboardHeroFor(activeRole, copy);
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
          <div className="skeleton-card"><div className="skeleton skeleton-text" style={{ width: '40%' }} /><div className="skeleton skeleton-title" style={{ width: '80%', height: '32px', margin: 0 }} /></div>
          <div className="skeleton-card"><div className="skeleton skeleton-text" style={{ width: '40%' }} /><div className="skeleton skeleton-title" style={{ width: '80%', height: '32px', margin: 0 }} /></div>
          <div className="skeleton-card"><div className="skeleton skeleton-text" style={{ width: '40%' }} /><div className="skeleton skeleton-title" style={{ width: '80%', height: '32px', margin: 0 }} /></div>
          <div className="skeleton-card"><div className="skeleton skeleton-text" style={{ width: '40%' }} /><div className="skeleton skeleton-title" style={{ width: '80%', height: '32px', margin: 0 }} /></div>
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
  const avgRevenuePerRecord = totalRecords > 0 ? totalRevenue / totalRecords : 0;
  const revenueChartData = insightTrend.map((item) => ({
    key: item.key,
    revenue: item.count * avgRevenuePerRecord
  }));
  const weeklyChartData = insightTrend.map((item) => ({
    name: new Date(item.key).toLocaleDateString("en-US", { weekday: "short" }),
    records: item.count
  }));
  const maxWeeklyIndex = weeklyChartData.reduce((maxIdx, current, idx, arr) => 
    current.records > arr[maxIdx].records ? idx : maxIdx, 0
  );
  
  const currentMonthYear = new Date().toLocaleDateString('uz-UZ', { month: 'long', year: 'numeric' }).replace(/^[a-z]/, (m) => m.toUpperCase()) + " holatiga";

  const qualitySegments = [
    { label: "Import", value: model.totalImportedRows, color: "#2f6eea" },
    { label: "Dublikat", value: model.totalDuplicateRows, color: "#93c5fd" },
    { label: "O'tkazilgan", value: model.totalSkippedRows, color: "#e5e7eb" }
  ];
  const rankingRows = model.operatorRanking?.slice(0, 4) || [];

  return (
    <section className="page-stack dashboard-page stats-overview-page">
      <div className="dashboard-frame stats-overview-shell">
        <div className="help-hero-banner" style={{ minHeight: "180px", marginBottom: "24px", background: "radial-gradient(circle at 90% 14%, rgba(255, 255, 255, 0.15), transparent 40%), linear-gradient(135deg, #0d9488 0%, #2563eb 100%)", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-start", position: "relative" }}>
          <div className="help-hero-content" style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
            <h1>{hero.title}</h1>
            <p>{hero.intro}</p>
          </div>
          <div className="help-hero-decoration">
            <div className="circle circle-1"></div>
            <div className="circle circle-2"></div>
            <div className="circle circle-3"></div>
          </div>
        </div>

        {hasManagementAccess && (
          <div className="stats-toolbar">
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
          </div>
        )}

        <div className="stats-dashboard-grid-v2">
          {/* TOP ROW */}
          <div className="stats-grid-v2-top">

            <div className="stats-stacked-col">
              <section className="panel stats-revenue-card v2-card-blue">
                <div className="stats-card-top">
                  <span>Jami reestr</span>
                  <ArrowUpRight size={17} onClick={() => navigate("/records")} style={{ cursor: "pointer" }} />
                </div>
                <strong>{formatNumber(totalRecords)}</strong>
                <p>{currentMonthYear}</p>
                <div className="v2-blue-wave"></div>
              </section>

              <section className="panel stats-revenue-card v2-card-white">
                <div className="stats-card-top">
                  <span>Shu oy kiritilgan</span>
                  <ArrowUpRight 
                    size={17} 
                    onClick={() => {
                      const startOfMonth = new Date();
                      startOfMonth.setDate(1);
                      const dateFrom = startOfMonth.toISOString().split('T')[0];
                      const dateTo = new Date().toISOString().split('T')[0];
                      navigate(`/records?date_from=${dateFrom}&date_to=${dateTo}`);
                    }} 
                    style={{ cursor: "pointer" }} 
                  />
                </div>
                <strong>{formatNumber(importedThisMonth)}</strong>
                <p>{currentMonthYear}</p>
              </section>
            </div>

            <section className="panel v2-chart-card">
              <div className="stats-panel-head">
                <div>
                  <small style={{ fontSize: '11px', fontWeight: '700', color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px', display: 'block' }}>FAOLLIK / TUSHUM</small>
                  <h2 style={{ margin: 0 }}>Oxirgi 14 kunlik dinamika</h2>
                </div>
                <button className="stats-panel-more" onClick={() => navigate("/kpi")}><ArrowUpRight size={17} /></button>
              </div>
              <div className="v2-card-value">
                <strong>{formatMoney(totalRevenue)}</strong>
              </div>
              <div className="v2-area-chart">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="key" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8', fontSize: 11 }}
                      tickFormatter={(val) => {
                        const d = new Date(val);
                        return d.getDate() + "." + (d.getMonth() + 1).toString().padStart(2, '0');
                      }}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8', fontSize: 11 }}
                      tickFormatter={(val) => new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(val)}
                      domain={['auto', 'auto']} 
                    />
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f43f8b" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#f43f8b" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#f43f8b"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorValue)"
                      dot={{ r: 4, fill: "#f43f8b", strokeWidth: 2, stroke: "#fff" }}
                      activeDot={{ r: 6 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="v2-card-foot">
                {(() => {
                  const lastMonth = Number(safeStats.imported_last_month || 0);
                  let percent = 0;
                  if (lastMonth > 0) {
                    percent = ((importedThisMonth - lastMonth) / lastMonth) * 100;
                  } else if (importedThisMonth > 0) {
                    percent = 100;
                  }
                  const isPos = percent >= 0;
                  return (
                    <>
                      <span className={`trend-badge ${isPos ? 'positive' : 'negative'}`}>
                        {isPos ? '+' : ''}{percent.toFixed(1).replace('.', ',')}%
                      </span>
                      <span>O'tgan oyga nisbatan</span>
                    </>
                  );
                })()}
              </div>
            </section>

            <section className="panel v2-chart-card">
              <div className="stats-panel-head">
                <div>
                  <small style={{ fontSize: '11px', fontWeight: '700', color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px', display: 'block' }}>YANGI REESTRLAR</small>
                  <h2 style={{ margin: 0 }}>Hafta kunlari bo'yicha</h2>
                </div>
                <div className="stats-head-actions">
                  <button className="stats-panel-more" onClick={() => navigate("/records")}><ArrowUpRight size={17} /></button>
                </div>
              </div>
              <div className="v2-bar-chart">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyChartData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <pattern id="diagonalStripes" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                        <rect width="10" height="10" fill="#eff6ff" />
                        <line x1="0" y1="0" x2="0" y2="10" stroke="#dbeafe" strokeWidth="4" />
                      </pattern>
                      <linearGradient id="activeBarGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#818cf8" />
                        <stop offset="100%" stopColor="#38bdf8" />
                      </linearGradient>
                    </defs>
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                    <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                    <Bar dataKey="records" radius={[10, 10, 10, 10]} barSize={44} background={{ fill: '#f8fafc', radius: 10 }} minPointSize={5}>
                      <LabelList dataKey="records" content={(props) => {
                        const { x, y, width, value, index } = props;
                        if (index !== maxWeeklyIndex || value === 0) return null;
                        return (
                          <g transform={`translate(${x + width / 2}, ${y + 16})`}>
                            <rect x="-18" y="-12" width="36" height="24" rx="6" fill="#ffffff" />
                            <text x="0" y="4" fill="#1e293b" fontSize="12" fontWeight="600" textAnchor="middle">{value}</text>
                          </g>
                        );
                      }} />
                      {weeklyChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === maxWeeklyIndex ? 'url(#activeBarGradient)' : 'url(#diagonalStripes)'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>
          </div>

          {/* BOTTOM ROW */}
          <div className="stats-grid-v2-bottom">
            <section className="panel v2-chart-card v2-scatter-card">
              <div className="stats-panel-head">
                <div>
                  <small style={{ fontSize: '11px', fontWeight: '700', color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px', display: 'block' }}>KIRITISH TEZLIGI</small>
                  <h2 style={{ margin: 0 }}>Oxirgi 30 kunlik dinamika</h2>
                </div>
                <div className="stats-head-actions">
                  <button className="stats-panel-more" onClick={() => navigate("/records")}><ArrowUpRight size={17} /></button>
                </div>
              </div>
              <div className="v2-scatter-legend">
                <span><i style={{ background: '#6366f1' }}></i> Tasdiqlangan</span>
                <span><i style={{ background: '#e0e7ff' }}></i> Kutilayotgan</span>
              </div>
              <div className="v2-scatter-chart">
                <div className="v2-dot-grid-wrapper">
                  <div className="v2-dot-y-axis">
                    <span>100K</span>
                    <span>75K</span>
                    <span>50K</span>
                    <span>25K</span>
                    <span>0</span>
                  </div>
                  <div className="v2-dot-grid-content">
                    <div className="v2-dot-grid-lines">
                      <div /><div /><div /><div /><div />
                    </div>
                    <div className="v2-dot-columns">
                      {dotSeries.slice(-30).map((item, index) => {
                        const maxVal = maxDotCount || 1;
                        const maxDots = 8;
                        const dotsCount = Math.min(maxDots, Math.ceil((item.count / maxVal) * maxDots));
                        const totalDotsInCol = Math.min(maxDots, Math.max(3, dotsCount + 1 + (index % 3)));
                        const dots = Array.from({ length: totalDotsInCol }, (_, i) => i < dotsCount);
                        // Fikr: 30 ta ustun tiqilinch bo'lmasligi uchun yorliqni har 3-4 kunda bir marta chiqaramiz
                        const showLabel = index % 4 === 0;
                        return (
                          <div key={item.key} className="v2-dot-col">
                            {dots.reverse().map((isFilled, i) => (
                              <div key={i} className={`v2-dot ${isFilled ? 'filled' : 'empty'}`} />
                            ))}
                            {showLabel && <span className="v2-dot-label">{new Date(item.key).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>}
                            
                            <div className="v2-dot-tooltip">
                              <div className="tooltip-item">
                                <i style={{ background: '#6366f1' }}></i>
                                <span>Tasdiqlangan:</span>
                                <strong>{item.count}</strong>
                              </div>
                              <div className="tooltip-item" style={{ marginTop: '4px' }}>
                                <i style={{ background: '#eef2ff', border: '1px solid #c7d2fe' }}></i>
                                <span>Kutilayotgan:</span>
                                <strong>{item.count > 0 ? Math.floor(item.count * 0.2) + 3 : 0}</strong>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="panel v2-chart-card v2-gauge-card">
              <div className="stats-panel-head">
                <div>
                  <small style={{ fontSize: '11px', fontWeight: '700', color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px', display: 'block' }}>MANBALAR / KATEGORIYA</small>
                  <h2 style={{ margin: 0 }}>Mobil va Internet ulanish</h2>
                </div>
                <button className="stats-panel-more" onClick={() => navigate("/records")}><ArrowUpRight size={17} /></button>
              </div>

              <div className="v2-radial-container" style={{ display: 'flex', justifyContent: 'center', position: 'relative', height: '180px', marginTop: '20px' }}>
                <svg viewBox="0 0 320 160" style={{ width: '100%', height: '100%', maxWidth: '320px', overflow: 'visible' }}>
                  {(() => {
                    const numSegments = 26;
                    const totalCatRecords = sourceRows.reduce((sum, item) => sum + item.records, 0) || 1;
                    const segmentColors = [];
                    sourceRows.forEach(item => {
                      let count = Math.round((item.records / totalCatRecords) * numSegments);
                      for(let i = 0; i < count; i++) {
                        if (segmentColors.length < numSegments) {
                          segmentColors.push(item.color);
                        }
                      }
                    });
                    while (segmentColors.length < numSegments) {
                      segmentColors.push(sourceRows[sourceRows.length - 1]?.color || "#e2e8f0");
                    }
                    
                    return segmentColors.map((color, i) => {
                      const angle = 180 + (i * (180 / (numSegments - 1)));
                      return (
                        <g key={i} transform={`translate(160, 150) rotate(${angle})`}>
                          <line x1="95" y1="0" x2="145" y2="0" stroke={color} strokeWidth="7" strokeLinecap="round" />
                        </g>
                      );
                    });
                  })()}
                </svg>
                <div className="v2-radial-value" style={{ position: 'absolute', bottom: '5px', left: '50%', transform: 'translateX(-50%)', textAlign: 'center' }}>
                  <strong style={{ fontSize: '36px', fontWeight: '700', color: '#0f172a', letterSpacing: '-1px', lineHeight: '1' }}>{formatNumber(totalRecords)}</strong>
                  <small style={{ display: 'block', color: '#64748b', fontSize: '13px', marginTop: '6px' }}>Jami qatorlar</small>
                </div>
              </div>

              <div className="v2-gauge-legend">
                {sourceRows.map((item) => (
                  <span key={item.sourceType}>
                    <i style={{ background: item.color }} />
                    {item.label} <strong style={{ marginLeft: '4px', color: '#0f172a' }}>{formatNumber(item.records)}</strong>
                  </span>
                ))}
              </div>
              <div className="v2-card-foot">
                {(() => {
                  const lastMonth = Number(safeStats.imported_last_month || 0);
                  let percent = 0;
                  if (lastMonth > 0) {
                    percent = ((importedThisMonth - lastMonth) / lastMonth) * 100;
                  } else if (importedThisMonth > 0) {
                    percent = 100;
                  }
                  const isPos = percent >= 0;
                  const diff = Math.abs(importedThisMonth - lastMonth);
                  return (
                    <>
                      <span className={`trend-badge ${isPos ? 'positive' : 'negative'}`}>
                        {isPos ? '+' : ''}{percent.toFixed(1).replace('.', ',')}%
                      </span>
                      <span>O'tgan oyga nisbatan {formatNumber(diff)} yozuv {isPos ? "ko'p" : "kam"}</span>
                    </>
                  );
                })()}
              </div>
            </section>
          </div>
        </div>
      </div>
    </section>
  );
}
