import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const numberFormat = new Intl.NumberFormat("uz-UZ");
const COLORS = ['#2f6eea', '#38bdf8', '#fbbf24', '#f87171', '#34d399', '#a78bfa', '#f472b6', '#94a3b8'];

export default function BreakdownPanel({ title, kicker, items = [], labelField, emptyText }) {
  const total = items.reduce((sum, item) => sum + Number(item.count || 0), 0);

  const data = items.slice(0, 8).map(item => ({
    name: item[labelField] || "-",
    value: Number(item.count || 0)
  }));

  return (
    <section className="panel dashboard-panel dashboard-breakdown-panel" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="panel-heading split" style={{ flexShrink: 0, marginBottom: '20px' }}>
        <div>
          <p className="panel-kicker">{kicker}</p>
          <h2>{title}</h2>
        </div>
        <span className="panel-badge secondary">
          {numberFormat.format(total)}
        </span>
      </div>

      <div style={{ flex: 1, minHeight: '260px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {items.length === 0 ? (
          <p className="empty-text">{emptyText}</p>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 24px rgba(21, 32, 55, 0.08)' }}
                itemStyle={{ fontWeight: 'bold' }}
                formatter={(value) => [numberFormat.format(value), 'Soni']}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36} 
                iconType="circle"
                wrapperStyle={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  );
}
