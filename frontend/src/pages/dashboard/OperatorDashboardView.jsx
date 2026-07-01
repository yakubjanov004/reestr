import React from "react";
import { ArrowUpRight, MoreHorizontal } from "lucide-react";
import {
  Line,
  LineChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { useI18n } from "../../localization/i18n.jsx";

const numberFormatter = new Intl.NumberFormat("de-DE");
function formatNumber(value) {
  return numberFormatter.format(Number(value || 0));
}

const WaveSVG = ({ color }) => (
  <svg viewBox="0 0 1440 320" style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '50%', zIndex: 0, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }} preserveAspectRatio="none">
    <path fill={color} fillOpacity="1" d="M0,128L48,138.7C96,149,192,171,288,160C384,149,480,107,576,112C672,117,768,171,864,197.3C960,224,1056,224,1152,202.7C1248,181,1344,139,1392,117.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
  </svg>
);

const CustomBadgeLabel = (props) => {
  const { x, y, width, value, index, maxIndex } = props;
  if (index !== maxIndex || value === 0) return null;
  return (
    <g transform={`translate(${x + width/2}, ${y - 12})`}>
      <rect x="-18" y="-14" width="36" height="22" rx="6" fill="#ffffff" style={{ filter: "drop-shadow(0px 4px 6px rgba(0,0,0,0.1))" }} />
      <text x="0" y="2" textAnchor="middle" fill="#6366f1" fontSize="12" fontWeight="700">{formatNumber(value)}</text>
    </g>
  );
};

const StackedDotsBar = (props) => {
  const { x, y, width, height, value } = props;
  const radius = Math.min(width / 2 - 2, 8); // Max radius 8
  const dots = [];
  const maxDots = Math.min(value, 9);
  if (maxDots === 0) return null;
  
  for(let i=0; i<maxDots; i++) {
    const opacity = 1 - (i * 0.08);
    const cy = y + height - radius - (i * (radius * 2 + 4));
    dots.push(
      <circle key={i} cx={x + width/2} cy={cy} r={radius} fill="#4f46e5" fillOpacity={opacity} />
    );
  }
  return <g>{dots}</g>;
};

export default function OperatorDashboardView({ stats, model }) {
  const { t, fmt } = useI18n();

  const sourceRows = model.sourceSummary.length ? model.sourceSummary : [
    { sourceType: "mobile", records: 0, imported_this_month: 0 },
    { sourceType: "internet", records: 0, imported_this_month: 0 }
  ];

  const mobileCount = sourceRows.find(r => r.sourceType === "mobile")?.records || 0;
  const mobileMonth = sourceRows.find(r => r.sourceType === "mobile")?.imported_this_month || 0;
  const internetCount = sourceRows.find(r => r.sourceType === "internet")?.records || 0;
  const internetMonth = sourceRows.find(r => r.sourceType === "internet")?.imported_this_month || 0;

  const totalRecords = Number(stats.total_records || 0);

  const recentDays = (stats.records_by_day || []).slice(-7).map(item => ({
    name: item.date.slice(5, 10),
    count: item.count,
    bgCount: item.count * 0.7 + (Math.random() * 5 + 5)
  }));
  const recordsLast7 = Number(stats.records_last_7 || 0);
  const trendPercent = stats.imported_this_month > 0 ? t.operatorDashboard.activeTrend : t.operatorDashboard.passiveTrend;

  const weeklyData = (stats.records_by_day_30 || []).slice(-7).map(item => ({
    name: t.dashboard.shortWeekdays[new Date(item.date).getDay()],
    amount: item.amount || 0,
    count: item.count || 0
  }));
  let maxIndex = 0;
  let maxVal = 0;
  weeklyData.forEach((d, i) => {
    if (d.amount > maxVal) { maxVal = d.amount; maxIndex = i; }
  });

  const dynamicsData = (stats.records_by_day_30 || []).slice(-15).map(item => ({
    name: new Date(item.date).getDate(),
    count: item.count || 0
  }));

  const mobilePercent = totalRecords > 0 ? Math.round((mobileCount / totalRecords) * 100) : 0;
  const totalSlices = 30;
  const blueSlices = Math.round((mobilePercent / 100) * totalSlices);
  const gaugeData = Array.from({ length: totalSlices }).map((_, i) => ({
    name: i < blueSlices ? t.source.mobileShort : t.source.internetShort,
    value: 1,
    fill: i < blueSlices ? "#2563eb" : "#e2e8f0"
  }));

  return (
    <div className="operator-dashboard-container">
      <div className="operator-dashboard-grid">
        
        {/* ROW 1 */}
        <div className="od-left-stack">
          <div className="od-card od-card-blue" style={{ padding: 0 }}>
            <div style={{ position: 'relative', zIndex: 1, padding: '24px' }}>
              <h3>{t.operatorDashboard.mobileRegistry}</h3>
              <div className="od-value">{formatNumber(mobileCount)}</div>
              <div className="od-sub">{fmt(t.operatorDashboard.enteredThisMonth, { count: formatNumber(mobileMonth) })}</div>
              <button className="od-icon-btn">
                <ArrowUpRight size={18} strokeWidth={2.5} />
              </button>
            </div>
            <WaveSVG color="#2563eb" />
          </div>
          <div className="od-card od-card-white" style={{ padding: 0 }}>
            <div style={{ position: 'relative', zIndex: 1, padding: '24px' }}>
              <h3>{t.operatorDashboard.internetRegistry}</h3>
              <div className="od-value">{formatNumber(internetCount)}</div>
              <div className="od-sub">{fmt(t.operatorDashboard.enteredThisMonth, { count: formatNumber(internetMonth) })}</div>
              <button className="od-icon-btn">
                <ArrowUpRight size={18} strokeWidth={2.5} />
              </button>
            </div>
            <WaveSVG color="#f8fafc" />
          </div>
        </div>

        <div className="od-card od-activity-card">
          <div className="od-card-header">
            <h3>{t.operatorDashboard.last7Activity}</h3>
            <div className="od-action-btn" style={{border: '1px solid #e2e8f0', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <MoreHorizontal size={16} color="#64748b" />
            </div>
          </div>
          <div className="od-value">{formatNumber(recordsLast7)}</div>
          <div className="od-activity-chart">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={recentDays} margin={{ top: 20, right: 10, left: 10, bottom: 10 }}>
                <Line type="linear" dataKey="bgCount" stroke="#fecdd3" strokeWidth={2.5} strokeDasharray="5 5" dot={false} isAnimationActive={false} />
                <Line type="linear" dataKey="count" stroke="#ec4899" strokeWidth={3} dot={{r: 4, strokeWidth: 2, fill: '#ec4899', stroke: '#ec4899'}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div style={{ marginTop: 12, display: 'flex', alignItems: 'center' }}>
            <span className="od-activity-badge">{trendPercent}</span>
            <span style={{fontSize: 12, color: '#64748b', fontWeight: 600}}>{t.operatorDashboard.comparedToMonthlyRating}</span>
          </div>
        </div>

        <div className="od-card od-revenue-card">
          <div className="od-card-header">
            <h3>{t.operatorDashboard.weeklyRevenue}</h3>
            <div style={{display: 'flex', gap: 8, alignItems: 'center'}}>
              <button className="od-export-btn">{t.dashboard.last7} <span>⌄</span></button>
              <div className="od-action-btn" style={{border: '1px solid #e2e8f0', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: 0}}>
                <MoreHorizontal size={16} color="#64748b" />
              </div>
            </div>
          </div>
          <div className="od-revenue-chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} margin={{ top: 30, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <pattern id="diagonalHatch" width="6" height="6" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                    <line x1="0" y1="0" x2="0" y2="6" style={{stroke: '#e2e8f0', strokeWidth: 2}} />
                  </pattern>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 600}} />
                <Tooltip cursor={{fill: 'rgba(241, 245, 249, 0.5)'}} contentStyle={{borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)'}} />
                <Bar dataKey="amount" radius={[8, 8, 8, 8]} maxBarSize={48} label={<CustomBadgeLabel maxIndex={maxIndex} />}>
                  {weeklyData.map((entry, index) => {
                    const isMax = index === maxIndex && entry.amount > 0;
                    return <Cell key={`cell-${index}`} fill={isMax ? "url(#barGradient)" : "url(#diagonalHatch)"} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ROW 2 */}
        <div className="od-card od-dynamics-card">
          <div className="od-card-header">
            <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
              <h3 style={{fontSize: 22}}>{t.operatorDashboard.monthlyUploadDynamics}</h3>
            </div>
            <div style={{display: 'flex', gap: 8, alignItems: 'center'}}>
              <button className="od-export-btn">{t.dashboard.currentMonth} <span>⌄</span></button>
              <button className="od-export-btn">{t.dashboard.summary} <span>⌄</span></button>
              <div className="od-action-btn" style={{border: '1px solid #e2e8f0', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: 0}}>
                <MoreHorizontal size={16} color="#64748b" />
              </div>
            </div>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12}}>
            <span className="od-legend-item"><div className="od-legend-dot" style={{background: '#6366f1'}}></div> {t.dashboard.uploads}</span>
            <span className="od-legend-item"><div className="od-legend-dot" style={{background: '#e2e8f0'}}></div> {t.operatorDashboard.amount}</span>
          </div>
          <div className="od-dynamics-chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dynamicsData} margin={{ top: 20, right: 0, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} />
                <YAxis tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 600}} axisLine={false} tickLine={false} domain={[0, 'dataMax']} />
                <Tooltip cursor={{fill: 'rgba(241, 245, 249, 0.5)'}} contentStyle={{borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)'}} />
                <Bar dataKey="count" shape={<StackedDotsBar />} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="od-card od-source-card">
          <div className="od-card-header">
            <h3 style={{fontSize: 22}}>{t.operatorDashboard.sourceShare}</h3>
            <div className="od-action-btn" style={{border: '1px solid #e2e8f0', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <ArrowUpRight size={16} color="#64748b" />
            </div>
          </div>
          <div className="od-source-chart" style={{marginTop: 30}}>
            <div className="od-donut-center">
              <strong>{formatNumber(totalRecords)}</strong>
              <span>{t.operatorDashboard.totalRecords}</span>
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={gaugeData}
                  cx="50%"
                  cy="65%"
                  startAngle={180}
                  endAngle={0}
                  innerRadius="75%"
                  outerRadius="100%"
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                  cornerRadius={10}
                >
                  {gaugeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="od-donut-footer" style={{marginTop: 10}}>
            <span className="od-legend-item"><div className="od-legend-dot" style={{background: '#2563eb'}}></div> {t.source.mobileShort}</span>
            <span className="od-legend-item"><div className="od-legend-dot" style={{background: '#e2e8f0'}}></div> {t.source.internetShort}</span>
          </div>
          <div className="od-bottom-note">
            <span className="od-badge-green">+{mobilePercent}%</span>
            <span>{fmt(t.operatorDashboard.mobileShareNote, { percent: mobilePercent })}</span>
          </div>
        </div>

      </div>
    </div>
  );
}
