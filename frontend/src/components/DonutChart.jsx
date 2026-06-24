import React from 'react';

export default function DonutChart({ data }) {
  // data = [{ label: 'Mobile', value: 100, color: 'var(--blue)' }, ...]
  const total = data.reduce((acc, item) => acc + item.value, 0);

  if (total === 0) {
    return (
      <div className="donut-chart-empty">
        <svg viewBox="0 0 100 100" className="donut-svg">
          <circle cx="50" cy="50" r="40" fill="transparent" stroke="var(--line)" strokeWidth="15" />
        </svg>
        <div className="donut-center">
          <strong>0</strong>
          <span>Total</span>
        </div>
      </div>
    );
  }

  let currentOffset = 0;
  const circumference = 2 * Math.PI * 40;

  return (
    <div className="donut-chart-wrapper">
      <svg viewBox="0 0 100 100" className="donut-svg">
        {data.map((item, idx) => {
          if (item.value === 0) return null;
          const strokeLength = (item.value / total) * circumference;
          const gapLength = circumference - strokeLength;
          const strokeDasharray = `${strokeLength} ${gapLength}`;
          const strokeDashoffset = -currentOffset;
          currentOffset += strokeLength;

          return (
            <circle
              key={idx}
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke={item.color}
              strokeWidth="15"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              transform="rotate(-90 50 50)"
              className="donut-segment"
            />
          );
        })}
      </svg>
      <div className="donut-center">
        <strong>{total}</strong>
        <span>Jami</span>
      </div>
      <div className="donut-legend">
        {data.map((item, idx) => (
          <div key={idx} className="legend-item">
            <span className="legend-dot" style={{ backgroundColor: item.color }} />
            <span className="legend-label">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
