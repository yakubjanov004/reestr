import { formatDateTime } from "../../utils/format.js";

export default function RecentUploadsPanel({ t, recentBatches }) {
  return (
    <section className="panel dashboard-panel">
      <div className="panel-heading split">
        <div>
          <p className="panel-kicker">{t.dashboard.table}</p>
          <h2>{t.dashboard.recentUploads}</h2>
        </div>
        <span className="panel-badge secondary">
          {recentBatches.length} {t.common.batchWord}
        </span>
      </div>
      <div className="table-wrap compact dashboard-table-wrap">
        <table>
          <thead>
            <tr>
              <th>{t.common.file}</th>
              <th>{t.common.operator}</th>
              <th>{t.dashboard.imported}</th>
              <th>{t.common.date}</th>
            </tr>
          </thead>
          <tbody>
            {recentBatches.map((batch) => (
              <tr key={batch.id}>
                <td>{batch.original_filename}</td>
                <td>{batch.uploaded_by_username}</td>
                <td>{batch.imported_count}</td>
                <td>{formatDateTime(batch.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
