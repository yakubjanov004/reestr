import React, { useMemo } from 'react';
import { useI18n } from '../localization/i18n';

export default function GithubHeatmap({ data = [], days = 180 }) {
  const { t } = useI18n();

  const { cells, maxCount } = useMemo(() => {
    const countsByDate = new Map();
    let max = 0;
    data.forEach(item => {
      countsByDate.set(item.date.split('T')[0], item.count);
      if (item.count > max) max = item.count;
    });

    const result = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startDate = new Date(today);
    startDate.setDate(today.getDate() - days + 1);

    const dayOfWeek = startDate.getDay();
    const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    startDate.setDate(startDate.getDate() - diff);

    let current = new Date(startDate);
    while (current <= today) {
      const dateStr = current.toISOString().split('T')[0];
      const count = countsByDate.get(dateStr) || 0;
      result.push({
        date: dateStr,
        count: count,
      });
      current.setDate(current.getDate() + 1);
    }
    return { cells: result, maxCount: max || 1 };
  }, [data, days]);

  const getColorLevel = (count) => {
    if (count === 0) return 'level-0';
    const ratio = count / maxCount;
    if (ratio <= 0.25) return 'level-1';
    if (ratio <= 0.5) return 'level-2';
    if (ratio <= 0.75) return 'level-3';
    return 'level-4';
  };

  // For formatting the weekday
  const formatDay = (dateStr) => {
    try {
      const d = new Date(dateStr);
      return new Intl.DateTimeFormat('uz-UZ', { weekday: 'short' }).format(d);
    } catch {
      return '';
    }
  };

  if (days <= 7) {
    return (
      <div className="heatmap-container heatmap-7days">
        <div className="heatmap-grid" style={{ gridTemplateRows: '1fr', gridAutoFlow: 'row', gridTemplateColumns: `repeat(${days}, 1fr)` }}>
          {cells.map((cell) => (
            <div key={cell.date} className="heatmap-day-column">
              <div className="heatmap-count-label">{cell.count > 0 ? cell.count : ''}</div>
              <div
                className={`heatmap-cell ${getColorLevel(cell.count)}`}
                title={`${cell.date}: ${cell.count} ta`}
              />
              <div className="heatmap-day-label">{formatDay(cell.date)}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="heatmap-container">
      <div className="heatmap-scroll">
        <div className="heatmap-grid">
          {cells.map((cell) => (
            <div
              key={cell.date}
              className={`heatmap-cell ${getColorLevel(cell.count)}`}
              title={`${cell.date}: ${cell.count} ta`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
