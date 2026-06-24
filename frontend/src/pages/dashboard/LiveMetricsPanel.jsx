import { ShieldCheck } from "lucide-react";

export default function LiveMetricsPanel({
  t,
  stats,
  missingYesterday,
  operatorRanking,
  topOperator,
  topRegion,
  topStatus
}) {
  return (
    <section className="panel dashboard-panel live-panel">
      <div className="panel-heading split">
        <div>
          <p className="panel-kicker">{t.dashboard.state}</p>
          <h2>{t.dashboard.realtime}</h2>
        </div>
        <ShieldCheck size={18} />
      </div>
      <div className="live-metrics">
        <div className="live-metric">
          <span>{t.dashboard.missingCount}</span>
          <strong>{missingYesterday.length}</strong>
        </div>
        <div className="live-metric">
          <span>{t.dashboard.last30Sub}</span>
          <strong>{stats.records_last_30 || 0}</strong>
        </div>
        <div className="live-metric">
          <span>{t.dashboard.topOperator}</span>
          <strong>{topOperator ? topOperator.full_name : "-"}</strong>
          {topOperator && <small>{topOperator.records_count} {t.common.recordsWord}</small>}
        </div>
        <div className="live-metric">
          <span>{t.dashboard.topRegion}</span>
          <strong>{topRegion ? topRegion.region : "-"}</strong>
          {topRegion && <small>{topRegion.count} {t.common.recordsWord}</small>}
        </div>
        <div className="live-metric">
          <span>{t.dashboard.topStatus}</span>
          <strong>{topStatus ? topStatus.status : "-"}</strong>
          {topStatus && <small>{topStatus.count} {t.common.recordsWord}</small>}
        </div>
      </div>
      <div className="summary-list mini-ranking">
        {operatorRanking.length > 0 ? (
          operatorRanking.slice(0, 5).map((operator, index) => (
            <div className="summary-row ranking-row" key={operator.id}>
              <span>
                {index + 1}. {operator.full_name}
              </span>
              <strong>{operator.records_count}</strong>
            </div>
          ))
        ) : (
          <p className="empty-text">{t.dashboard.noOperatorRating}</p>
        )}
      </div>
    </section>
  );
}
