export default function SourceSummaryPanel({ t, sourceSummary, totalSourceRecords }) {
  return (
    <section className="panel dashboard-panel source-panel">
      <div className="panel-heading split">
        <div>
          <p className="panel-kicker">{t.dashboard.source}</p>
          <h2>{t.dashboard.sourceSummary}</h2>
        </div>
      </div>
      <div className="source-overview">
        <div className="source-total">
          <span>{t.dashboard.totalSourceRecord}</span>
          <strong>{totalSourceRecords}</strong>
        </div>
        <div className="summary-list source-summary">
          {sourceSummary.length > 0 ? (
            sourceSummary.map((item) => {
              const share =
                totalSourceRecords > 0 ? Math.round((item.records / totalSourceRecords) * 100) : 0;
              return (
                <div className="source-row" key={item.sourceType}>
                  <div className="summary-row">
                    <span>{item.sourceType === "mobile" ? t.source.mobile : t.source.internet}</span>
                    <strong>{item.records || 0}</strong>
                  </div>
                  <div className="source-meta">
                    <span>{t.dashboard.sourceUploads}: {item.uploads || 0}</span>
                    <span>{t.dashboard.sourceMonth}: {item.imported_this_month || 0}</span>
                    <span>{share}%</span>
                  </div>
                  <div className="bar-track source-track">
                    <div style={{ width: `${share}%` }} />
                  </div>
                </div>
              );
            })
          ) : (
            <p className="empty-text">{t.dashboard.sourceNoData}</p>
          )}
        </div>
      </div>
    </section>
  );
}
