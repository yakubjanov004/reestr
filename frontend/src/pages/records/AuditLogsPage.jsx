import { useEffect, useState } from "react";
import { Activity, Filter, ScrollText, ShieldCheck, UserRound } from "lucide-react";

import api from "../../api/client.js";
import { useAuth } from "../../auth/AuthContext.jsx";
import { ROLE_ADMIN, ROLE_MANAGER, ROLE_SUPERVISOR, roleLabel } from "../../auth/roles.js";
import PageHero from "../../components/PageHero.jsx";
import { useI18n } from "../../localization/i18n.jsx";
import { formatDateTime } from "../../utils/format.js";

const actionKeys = [
  "login",
  "login_sms_requested",
  "upload_created",
  "operator_created",
  "operator_updated",
  "operator_status_changed",
  "operator_password_changed",
  "self_profile_updated",
  "self_password_changed"
];

const PAGE_SIZE = 30;

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

function actionClassName(action) {
  if (action === "upload_created") return "audit-action-badge audit-action-upload";
  if (action === "operator_created") return "audit-action-badge audit-action-create";
  if (action === "operator_status_changed") return "audit-action-badge audit-action-status";
  if (action === "operator_password_changed") return "audit-action-badge audit-action-password";
  if (action?.includes("delete")) return "audit-action-badge audit-action-delete";
  return "audit-action-badge";
}

function permissionLabel(t, user) {
  if (user?.role === ROLE_ADMIN || user?.is_superuser) return t.roles.admin;
  if (user?.role === ROLE_MANAGER) return t.roles.manager;
  if (user?.role === ROLE_SUPERVISOR) return t.roles.supervisor;
  return t.common.notEntered;
}

export default function AuditLogsPage() {
  const { t } = useI18n();
  const { user } = useAuth();
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

  const rangeStart = meta.count === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min((page - 1) * PAGE_SIZE + logs.length, meta.count);

  return (
    <section className="page-stack audit-page">
      <PageHero
        kicker={t.audit.heroKicker}
        title={t.audit.title}
        description={t.audit.description}
        icon={ScrollText}
        stats={[
          { label: t.audit.totalLog, value: meta.count, icon: ScrollText },
          { label: t.audit.currentPage, value: logs.length, icon: Activity },
          { label: t.audit.actionTypes, value: actionKeys.length, icon: Filter },
          { label: t.audit.permission, value: permissionLabel(t, user), icon: ShieldCheck }
        ]}
      />

      <section className="panel audit-table-panel">
        <div className="panel-heading split">
          <div className="audit-heading-title">
            <h2>{t.audit.title}</h2>
            <span className="panel-badge secondary">{rangeStart}-{rangeEnd} / {meta.count}</span>
          </div>
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
                  return (
                    <tr key={log.id}>
                      <td style={{ color: 'var(--muted)', fontSize: '12.5px', whiteSpace: 'nowrap' }}>
                        {formatDateTime(log.created_at)}
                      </td>
                      <td>
                        <div className="audit-user-cell">
                          <span className="audit-user-icon">
                            <UserRound size={14} />
                          </span>
                          <div>
                            <strong>{log.actor_full_name || log.actor_username || "-"}</strong>
                            <small>
                              {log.actor_username ? `@${log.actor_username}` : ""}
                              {log.actor_role ? ` · ${roleLabel(t, log.actor_role)}` : ""}
                            </small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={actionClassName(log.action)}>
                          {t.audit.actions[log.action] || log.action}
                        </span>
                      </td>
                      <td>
                        <span className="audit-target">
                          {log.target_label || log.target_type || "-"}
                        </span>
                      </td>
                      <td>
                        <span className="audit-details">{metadataText(log.metadata, t) || "-"}</span>
                      </td>
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

        <div className="pagination audit-pagination">
          <span>{rangeStart}-{rangeEnd} / {meta.count}</span>
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
