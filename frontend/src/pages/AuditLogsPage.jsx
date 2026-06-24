import { useEffect, useState } from "react";
import { Activity, Filter, ScrollText, ShieldCheck } from "lucide-react";

import api from "../api/client.js";
import { roleLabel } from "../auth/roles.js";
import PageHero from "../components/PageHero.jsx";
import { useI18n } from "../localization/i18n.jsx";
import { formatDateTime } from "../utils/format.js";

const actionKeys = [
  "login",
  "upload_created",
  "operator_created",
  "operator_updated",
  "operator_status_changed",
  "operator_password_changed"
];

function metadataText(metadata = {}, t) {
  if (metadata.imported_count !== undefined) {
    return `${t.audit.metadata.rows} ${metadata.rows_in_file}, ${t.audit.metadata.import} ${metadata.imported_count}, ${t.audit.metadata.duplicate} ${metadata.duplicate_count}, ${t.audit.metadata.skipped} ${metadata.skipped_count}`;
  }
  if (metadata.is_active !== undefined) {
    return metadata.is_active ? t.audit.metadata.activated : t.audit.metadata.blocked;
  }
  if (metadata.role) {
    return roleLabel(t, metadata.role);
  }
  if (metadata.changed_fields?.length) {
    return metadata.changed_fields.join(", ");
  }
  if (metadata.ip) {
    return metadata.ip;
  }
  return "";
}

export default function AuditLogsPage() {
  const { t } = useI18n();
  const [logs, setLogs] = useState([]);
  const [action, setAction] = useState("");
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ count: 0, next: null, previous: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .get("/audit-logs/", { params: { page, action: action || undefined } })
      .then((response) => {
        setLogs(response.data.results || []);
        setMeta({
          count: response.data.count || 0,
          next: response.data.next,
          previous: response.data.previous
        });
      })
      .finally(() => setLoading(false));
  }, [page, action]);

  function handleAction(value) {
    setAction(value);
    setPage(1);
  }

  return (
    <section className="page-stack">
      <PageHero
        kicker={t.audit.heroKicker}
        title={t.audit.title}
        description={t.audit.description}
        icon={ScrollText}
        stats={[
          { label: t.audit.totalLog, value: meta.count, icon: ScrollText },
          { label: t.audit.currentPage, value: logs.length, icon: Activity },
          { label: t.audit.actionTypes, value: actionKeys.length, icon: Filter },
          { label: t.audit.permission, value: "MGR", icon: ShieldCheck }
        ]}
      />

      <section className="panel">
        <div className="panel-heading split">
          <h2>{t.audit.title}</h2>
          <label className="audit-filter">
            {t.audit.action}
            <select value={action} onChange={(event) => handleAction(event.target.value)}>
              <option value="">{t.common.all}</option>
              {actionKeys.map((value) => (
                <option value={value} key={value}>
                  {t.audit.actions[value] || value}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>{t.common.date}</th>
                <th>{t.audit.user}</th>
                <th>{t.audit.action}</th>
                <th>{t.audit.object}</th>
                <th>{t.common.details}</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan="5">{t.common.loading}</td>
                </tr>
              )}
              {!loading &&
                logs.map((log) => {
                  const actionClass =
                    log.action === "upload_created" ? "audit-action-upload" :
                    log.action === "operator_created" ? "audit-action-create" :
                    log.action?.includes("delete") ? "audit-action-delete" : "";
                  return (
                    <tr key={log.id}>
                      <td style={{ color: 'var(--muted)', fontSize: '12.5px', whiteSpace: 'nowrap' }}>
                        {formatDateTime(log.created_at)}
                      </td>
                      <td style={{ fontWeight: 600 }}>{log.actor_username || "-"}</td>
                      <td>
                        <span className={actionClass} style={{ fontSize: '13px' }}>
                          {t.audit.actions[log.action] || log.action}
                        </span>
                      </td>
                      <td style={{ color: 'var(--muted)' }}>{log.target_label || log.target_type}</td>
                      <td style={{ color: 'var(--muted)', fontSize: '12.5px' }}>{metadataText(log.metadata, t)}</td>
                    </tr>
                  );
                })}
              {!loading && logs.length === 0 && (
                <tr>
                  <td colSpan="5">{t.audit.noLogs}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <span>{t.common.total}: {meta.count}</span>
          <div>
            <button type="button" disabled={!meta.previous} onClick={() => setPage(page - 1)}>
              {t.common.previous}
            </button>
            <strong>{page}</strong>
            <button type="button" disabled={!meta.next} onClick={() => setPage(page + 1)}>
              {t.common.next}
            </button>
          </div>
        </div>
      </section>
    </section>
  );
}
