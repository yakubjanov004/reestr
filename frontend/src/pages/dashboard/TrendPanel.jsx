import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatDate } from "../../utils/format.js";

export default function TrendPanel({ t, stats, daySeries }) {
  // Format dates for X-axis
  const formattedData = daySeries.map(item => ({
    ...item,
    formattedDate: formatDate(item.date).split(',')[0], // Just get the day/month part
    count: Number(item.count)
  }));

  return (
    <section className="panel dashboard-panel large-panel" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="panel-heading split" style={{ flexShrink: 0, marginBottom: '20px' }}>
        <div>
          <p className="panel-kicker">{t.dashboard.trend}</p>
          <h2>{t.dashboard.last30Import}</h2>
        </div>
        <span className="panel-badge">
          {stats.records_last_30 || 0} {t.common.itemSuffix} {t.common.recordsWord}
        </span>
      </div>
      <div style={{ flex: 1, minHeight: '260px', width: '100%' }}>
        {formattedData.length === 0 ? (
          <p className="empty-text">{t.dashboard.noImportsMonth}</p>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis 
                dataKey="formattedDate" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#8a95a8', fontSize: 12 }} 
                dy={10} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#8a95a8', fontSize: 12 }} 
                tickFormatter={(value) => value.toLocaleString()}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 24px rgba(21, 32, 55, 0.08)' }}
                itemStyle={{ color: 'var(--primary)', fontWeight: 'bold' }}
                formatter={(value) => [value.toLocaleString(), t.dashboard.recordsTooltip]}
                labelStyle={{ color: 'var(--ink)', fontWeight: '600', marginBottom: '4px' }}
              />
              <Area 
                type="monotone" 
                dataKey="count" 
                stroke="var(--primary)" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorCount)" 
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  );
}
