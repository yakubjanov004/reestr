import {
  Activity,
  BarChart2,
  Users,
  Wallet,
  TrendingUp,
  CalendarDays,
  Landmark
} from "lucide-react";
import {
  Area,
  AreaChart,
  Brush,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import { useAuth } from "../../auth/AuthContext.jsx";
import { canManageUsers, ROLE_MANAGER, ROLE_ADMIN, ROLE_SUPERVISOR } from "../../auth/roles.js";
import { useI18n } from "../../localization/i18n.jsx";
import { createDashboardModel } from "../dashboard/dashboardModel.js";
import { useDashboardData } from "../dashboard/useDashboardData.js";

const numberFormatter = new Intl.NumberFormat("de-DE");
const moneyFormatter = new Intl.NumberFormat("de-DE", {
  maximumFractionDigits: 0
});

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
  return numberFormatter.format(number);
}

const uzbekMonths = [
  "yanvar", "fevral", "mart", "aprel", "may", "iyun", 
  "iyul", "avgust", "sentyabr", "oktyabr", "noyabr", "dekabr"
];

function formatShortDate(value) {
  if (!value) return "";
  const d = new Date(value);
  return `${d.getDate()}-${uzbekMonths[d.getMonth()]}`;
}

function dateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function buildRecentActivity(series, days = 7) {
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
      date: formatShortDate(key),
      count: counts.get(key) || 0
    };
  });
}

function buildSalesActivity(series, days = 30) {
  const normalized = (series || [])
    .map((item) => ({
      key: String(item.date || "").slice(0, 10),
      amount: Number(item.amount || 0)
    }))
    .filter((item) => item.key);
  const amounts = new Map(normalized.map((item) => [item.key, item.amount]));
  const endDate = new Date();
  return Array.from({ length: days }, (_, index) => {
    const date = new Date(endDate);
    date.setDate(endDate.getDate() - (days - index - 1));
    const key = dateKey(date);
    return {
      key,
      date: formatShortDate(key),
      amount: amounts.get(key) || 0
    };
  });
}

const sourceColors = {
  mobile: {
    id: "gradMobile",
    css: "var(--brand-gradient)",
    svgStart: "#2563eb",
    svgEnd: "#1d4ed8",
  },
  internet: {
    id: "gradInternet",
    css: "linear-gradient(135deg, #10b981 0%, #065f46 100%)",
    svgStart: "#10b981",
    svgEnd: "#065f46",
  },
  unknown: {
    id: "gradUnknown",
    css: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
    svgStart: "#f59e0b",
    svgEnd: "#d97706",
  }
};

export default function KpiPage() {
  const { t } = useI18n();
  const { user } = useAuth();
  const hasManagementAccess = canManageUsers(user);
  const { stats, loading } = useDashboardData();

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
  const successRate = model.importSuccessRate || 0;
  const weeklyRecords = Number(safeStats.records_last_7 || 0);
  const totalRecords = Number(safeStats.total_records || 0);
  const totalUploads = Number(safeStats.total_uploads || 0);
  const totalAmount = Number(kpi.total_amount || safeStats.total_revenue || 0);
  const weeklyAmount = Number(kpi.amount_last_7 || 0);
  const monthAmount = Number(kpi.amount_this_month || 0);
  const averageAmount = Number(kpi.average_amount || 0);

  const todayAmount = Number(kpi.amount_today || 0);

  const cards = [
    {
      label: "Bugungi",
      value: formatMoney(todayAmount),
      icon: Wallet,
      tone: "blue"
    },
    {
      label: "7 kunlik",
      value: formatMoney(weeklyAmount),
      icon: TrendingUp,
      tone: "green"
    },
    {
      label: "Shu oy",
      value: formatMoney(monthAmount),
      icon: CalendarDays,
      tone: "violet"
    },
    {
      label: "Jami",
      value: formatMoney(totalAmount),
      icon: Landmark,
      tone: "amber"
    }
  ];

  const sourceRows = model.sourceSummary.length
    ? model.sourceSummary
    : [
        { sourceType: "mobile", records: 0, uploads: 0 },
        { sourceType: "internet", records: 0, uploads: 0 }
      ];
  const activityData = buildRecentActivity(model.heatmapSeries || model.daySeries, 7);
  const activityData30 = buildSalesActivity(model.heatmapSeries || model.daySeries, 30);
  const sourceChartData = sourceRows.map((item) => ({
    name: t.source?.[item.sourceType] || item.sourceType,
    sourceType: item.sourceType,
    amount: Number(item.revenue || 0),
    records: Number(item.records || 0),
    uploads: Number(item.uploads || 0),
    style: sourceColors[item.sourceType] || sourceColors.unknown
  }));
  const sourceTotal = sourceChartData.reduce((sum, item) => sum + item.amount, 0);
  const sourceRecordTotal = sourceChartData.reduce((sum, item) => sum + item.records, 0);
  const sourcePieData = sourceChartData.map((item) => ({
    ...item,
    value: sourceTotal > 0 ? item.amount : item.records
  }));
  const importRows = [
    { label: "Reestr", value: totalRecords, note: "Jami yozuv" },
    { label: "Yuklash", value: totalUploads, note: "Excel importlar" },
    { label: "Import", value: model.totalImportedRows, note: "Qabul qilingan qator" },
    { label: "Dublikat", value: model.totalDuplicateRows, note: "Takroriy qator" }
  ];

  return (
    <section className="page-stack operator-page operator-kpi-page">
      <div className="kpi-top-grid">
        <section className="panel kpi-primary-panel">
          <small style={{ fontSize: '16px', fontWeight: '700', color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>BARCHA DAVR UCHUN</small>
          <h2 style={{ margin: 0 }}>Umumiy savdo</h2>
          <span className="kpi-primary-value">{formatMoney(totalAmount)}</span>
        </section>

        <section className="panel kpi-chart-panel kpi-activity-panel">
          <div className="panel-heading">
            <div>
              <small style={{ fontSize: '11px', fontWeight: '700', color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px', display: 'block' }}>FAOLLIK / REESTRLAR</small>
              <h2 style={{ margin: 0 }}>Oxirgi 7 kunlik yozuvlar</h2>
            </div>
            <span className="panel-badge secondary">{formatNumber(weeklyRecords)} yozuv</span>
          </div>
          <div className="kpi-chart-body">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activityData} margin={{ top: 12, right: 10, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="kpiActivityFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.24} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#e8eef6" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" tick={{ fill: "#8a95a8", fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fill: "#8a95a8", fontSize: 11 }} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ border: 0, borderRadius: 12, boxShadow: "0 10px 24px rgba(15, 35, 70, 0.10)" }}
                    formatter={(value) => [`${formatNumber(value)} ta`, "Reestr"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="#2563eb"
                    strokeWidth={3}
                    fill="url(#kpiActivityFill)"
                    dot={{ r: 3, fill: "#2563eb", strokeWidth: 0 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
          </div>
        </section>

        <section className="panel kpi-source-mix-panel">
          <div className="panel-heading kpi-source-heading">
            <div>
              <small style={{ fontSize: '11px', fontWeight: '700', color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px', display: 'block' }}>MANBALAR / KATEGORIYA</small>
              <h2 style={{ margin: 0 }}>Tushumlarning manba ulushi</h2>
            </div>
            <div className="source-heading-icon">
              <BarChart2 size={20} />
            </div>
          </div>
          <div className="kpi-source-mix-body">
            <div className="kpi-donut-wrap">
              {sourcePieData.every((item) => item.value === 0) ? (
                <div className="kpi-empty-donut">0</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <defs>
                      {Object.values(sourceColors).map((g) => (
                        <linearGradient id={g.id} key={g.id} x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor={g.svgStart} />
                          <stop offset="100%" stopColor={g.svgEnd} />
                        </linearGradient>
                      ))}
                    </defs>
                    <Pie
                      data={sourcePieData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={46}
                      outerRadius={76}
                      paddingAngle={0}
                      stroke="none"
                    >
                      {sourcePieData.map((item) => (
                        <Cell key={item.sourceType} fill={`url(#${item.style.id})`} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ border: 0, borderRadius: 12, boxShadow: "0 10px 24px rgba(15, 35, 70, 0.10)" }}
                      formatter={(value, name, entry) => [
                        sourceTotal > 0 ? formatMoney(entry.payload.amount) : `${formatNumber(value)} ta`,
                        name
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
              <div className="kpi-donut-center">
                <span>{formatCompact(sourceTotal || sourceRecordTotal)}</span>
                <small>{sourceTotal > 0 ? "so'm" : "yozuv"}</small>
              </div>
            </div>
            <div className="kpi-source-legend">
              {sourceChartData.map((item) => {
                const share = sourceTotal > 0
                  ? Math.round((item.amount / sourceTotal) * 100)
                  : sourceRecordTotal > 0
                    ? Math.round((item.records / sourceRecordTotal) * 100)
                    : 0;
                return (
                  <div className="kpi-source-legend-row" key={item.sourceType}>
                    <span style={{ background: item.style.css }} />
                    <div>
                      <small>{item.name}</small>
                      <span className="kpi-source-amount">{formatMoney(item.amount)}</span>
                    </div>
                    <span className="kpi-source-share">{share}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>

      <div className="operator-metric-grid">
        {cards.map((card, idx) => (
          <div key={idx} className={`operator-metric-card ${card.tone}`}>
            <div className="operator-metric-icon">
              <card.icon size={22} strokeWidth={2.5} />
            </div>
            <div>
              <p>{card.label}</p>
              <span className="operator-metric-value">{card.value}</span>
            </div>
          </div>
        ))}
      </div>

      <section className="panel kpi-chart-panel">
        <div className="panel-heading">
          <div>
            <small style={{ fontSize: '11px', fontWeight: '700', color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px', display: 'block' }}>MOLIYAVIY DINAMIKA</small>
            <h2 style={{ margin: 0 }}>Oxirgi 30 kunlik savdo grafigi</h2>
          </div>
          <Activity size={20} />
        </div>
        <div className="kpi-long-chart-scroll" style={{ height: 320, width: "100%", padding: "20px 0 10px", overflowX: "auto" }}>
          <div className="kpi-long-chart-inner" style={{ minWidth: "1000px", width: "100%", height: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData30} margin={{ top: 10, right: 15, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="kpiBrushFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#e8eef6" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" tick={{ fill: "#8a95a8", fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: "#8a95a8", fontSize: 11 }} tickFormatter={(val) => formatCompact(val)} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ border: 0, borderRadius: 12, boxShadow: "0 10px 24px rgba(15, 35, 70, 0.10)" }}
                  formatter={(value) => [formatMoney(value), "Savdo"]}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#10b981"
                  strokeWidth={3}
                  fill="url(#kpiBrushFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {hasManagementAccess && (
        <div className="kpi-management-grid" style={{ display: 'grid', gap: '24px' }}>
          {(user?.role === ROLE_MANAGER || user?.role === ROLE_ADMIN) && model.organizationBranchSummary && model.organizationBranchSummary.length > 0 && (
            <section className="panel operator-kpi-panel github-style-panel">
              <div className="stats-panel-head">
                <div>
                  <small style={{ fontSize: '11px', fontWeight: '700', color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px', display: 'block' }}>HUDUDIY KO'RSATKICHLAR</small>
                  <h2 style={{ margin: 0 }}>Filiallar kesimida KPI</h2>
                  <p>Barcha filiallar bo'yicha umumiy savdo va yozuvlar ko'rsatkichlari</p>
                </div>
                <Users size={20} />
              </div>
              <div className="operator-kpi-body" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
                {model.organizationBranchSummary.map((branch, idx) => {
                  const branchRevenue = Number(branch.revenue || 0);
                  const share = totalAmount > 0 ? (branchRevenue / totalAmount) * 100 : 0;
                  return (
                    <div key={idx} className="operator-source-list" style={{ padding: "16px", border: "1px solid var(--line)", borderRadius: "12px", background: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                      <div className="operator-progress-head">
                        <span style={{ fontWeight: 600, color: 'var(--ink)' }}>{branch.branch}</span>
                        <span className="operator-progress-value" style={{ color: 'var(--blue)', fontWeight: 700 }}>{formatMoney(branchRevenue)}</span>
                      </div>
                      <div className="operator-progress-track">
                        <span style={{ width: `${Math.min(100, Math.max(0, share))}%`, background: 'var(--blue)' }} />
                      </div>
                      <div className="operator-kpi-split" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--muted)', marginTop: '12px' }}>
                        <span>Hudud: {branch.region}</span>
                        <span>Yozuvlar: {formatNumber(branch.records)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {(user?.role === ROLE_SUPERVISOR || user?.role === ROLE_MANAGER || user?.role === ROLE_ADMIN) && model.operators && model.operators.length > 0 && (
            <section className="panel operator-kpi-panel github-style-panel">
              <div className="stats-panel-head">
                <div>
                  <small style={{ fontSize: '11px', fontWeight: '700', color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px', display: 'block' }}>XODIMLAR NATIJADORLIGI</small>
                  <h2 style={{ margin: 0 }}>Operatorlar kesimida KPI</h2>
                  <p>Sizga biriktirilgan operatorlarning savdo va yozuvlar ko'rsatkichlari</p>
                </div>
                <Users size={20} />
              </div>
              <div className="operator-kpi-body" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                {model.operators.map((operator) => {
                  const operatorRevenue = Number(operator.total_revenue || 0);
                  const share = totalAmount > 0 ? (operatorRevenue / totalAmount) * 100 : 0;
                  return (
                    <div key={operator.id} className="operator-source-list" style={{ padding: "16px", border: "1px solid var(--line)", borderRadius: "12px", background: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                      <div className="operator-progress-head">
                        <span style={{ fontWeight: 600, color: 'var(--ink)' }}>{operator.full_name || operator.username}</span>
                        <span className="operator-progress-value" style={{ color: 'var(--green)', fontWeight: 700 }}>{formatMoney(operatorRevenue)}</span>
                      </div>
                      <div className="operator-progress-track">
                        <span style={{ width: `${Math.min(100, Math.max(0, share))}%`, background: 'var(--green)' }} />
                      </div>
                      <div className="operator-kpi-split" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--muted)', marginTop: '12px' }}>
                        <span>Yozuvlar: {formatNumber(operator.records_count)}</span>
                        <span>Yuklashlar: {formatNumber(operator.uploads_count)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      )}
    </section>
  );
}
