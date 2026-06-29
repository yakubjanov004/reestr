import { Database, FileSpreadsheet, Upload } from "lucide-react";

const numberFormatter = new Intl.NumberFormat("de-DE");

function initials(operator) {
  const source = operator.full_name || operator.username || "";
  const parts = source.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return source.slice(0, 2).toUpperCase();
}

export default function SupervisorOperatorCard({
  operator,
  statusLabel,
  StatusIcon,
  t,
  onOpenRecords,
  onOpenBatches
}) {
  const statusClass = `sv-op-status-${operator.status}`;

  return (
    <div className={`sv-operator-card ${statusClass}`}>
      <div className="sv-op-card-header">
        <div className="sv-op-avatar">
          {initials(operator)}
        </div>
        <div className="sv-op-identity">
          <strong className="sv-op-name">{operator.full_name || operator.username}</strong>
          <span className="sv-op-username">@{operator.username}</span>
        </div>
        <div className={`sv-op-status-badge ${statusClass}`}>
          <StatusIcon size={14} />
          <span>{statusLabel}</span>
        </div>
      </div>

      <div className="sv-op-location-row">
        {operator.region_name && (
          <span>{operator.region_name}</span>
        )}
        {operator.branch_name && (
          <span>{operator.branch_name}</span>
        )}
      </div>

      <div className="sv-op-card-metrics">
        <div className="sv-op-metric">
          <Upload size={14} />
          <span className="sv-op-metric-label">{t.monitoring.todayUploads}</span>
          <strong className="sv-op-metric-value">{operator.today_uploads || 0}</strong>
        </div>
        <div className="sv-op-metric">
          <Database size={14} />
          <span className="sv-op-metric-label">{t.monitoring.todayImports}</span>
          <strong className="sv-op-metric-value">{numberFormatter.format(operator.today_records || 0)}</strong>
        </div>
        <div className="sv-op-metric">
          <Database size={14} />
          <span className="sv-op-metric-label">{t.monitoring.totalRecords}</span>
          <strong className="sv-op-metric-value">{numberFormatter.format(operator.records_count || 0)}</strong>
        </div>
      </div>

      <div className="sv-op-card-footer">
        <span className="sv-op-last-upload">
          {t.monitoring.lastUpload}: {operator.timeAgo}
        </span>
      </div>

      <div className="sv-op-card-actions">
        <button type="button" onClick={() => onOpenRecords(operator)}>
          <Database size={13} />
          <span>{t.monitoring.openRecords}</span>
        </button>
        <button type="button" onClick={() => onOpenBatches(operator)}>
          <FileSpreadsheet size={13} />
          <span>{t.monitoring.openBatches}</span>
        </button>
      </div>
    </div>
  );
}
