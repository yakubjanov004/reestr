import { useEffect, useState } from "react";
import {
  BellRing,
  MessageSquarePlus,
  Send,
  UserCheck
} from "lucide-react";

import api from "../../api/client.js";
import { useAuth } from "../../auth/AuthContext.jsx";
import {
  ROLE_OPERATOR,
  ROLE_SUPERVISOR,
  effectiveRole,
  hasRoleAtLeast
} from "../../auth/roles.js";
import { useI18n } from "../../localization/i18n.jsx";
import { formatDateTime } from "../../utils/format.js";

const managerTargetValues = ["all", "supervisor"];

function formatApiError(data, fallback) {
  if (!data) return fallback;
  if (typeof data === "string") return fallback;
  if (data.detail) return data.detail;
  return fallback;
}

function announcementLocation(item, t) {
  const parts = [item.assigned_region_name, item.assigned_branch_name].filter(Boolean);
  return parts.length ? parts.join(" / ") : t.announcements.general;
}

export default function AnnouncementsPage() {
  const { user } = useAuth();
  const { t, fmt } = useI18n();
  const activeRole = effectiveRole(user) || ROLE_OPERATOR;
  const canCreate = hasRoleAtLeast(user, ROLE_SUPERVISOR);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ title: "", body: "", target: "all" });

  function loadAnnouncements() {
    setLoading(true);
    api
      .get("/announcements/")
      .then((response) => setAnnouncements(response.data || []))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadAnnouncements();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = {
        title: form.title,
        body: form.body,
        target: activeRole === ROLE_SUPERVISOR ? "operator" : form.target
      };
      await api.post("/announcements/", payload);
      setForm({ title: "", body: "", target: "all" });
      loadAnnouncements();
    } catch (err) {
      setError(formatApiError(err.response?.data, t.announcements.createError));
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="page-stack operator-page operator-announcements-page">
      <div className="help-hero-banner" style={{ minHeight: "200px", marginBottom: "20px", background: "radial-gradient(circle at 90% 14%, rgba(255, 255, 255, 0.15), transparent 40%), var(--brand-gradient)" }}>
        <div className="help-hero-content">
          <h1>{t.announcements.heroTitle}</h1>
          <p>{t.announcements.heroDescription}</p>
        </div>
        <div className="help-hero-decoration">
          <div className="circle circle-1"></div>
          <div className="circle circle-2"></div>
          <div className="circle circle-3"></div>
        </div>
      </div>

      <div className={`announcements-layout ${canCreate ? "" : "reader-only"}`}>
        {canCreate && (
          <section className="panel announcement-create-panel">
            <div className="panel-heading">
              <div>
                <span className="panel-kicker">{t.announcements.newMessage}</span>
                <h2>{t.announcements.writeTitle}</h2>
              </div>
              <MessageSquarePlus size={20} />
            </div>
            <form className="announcement-form" onSubmit={handleSubmit}>
              <label>
                {t.announcements.titleLabel}
                <input
                  value={form.title}
                  onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                  placeholder={t.announcements.titlePlaceholder}
                  maxLength={180}
                  required
                />
              </label>

              {activeRole === ROLE_SUPERVISOR ? (
                <div className="announcement-fixed-target">
                  <UserCheck size={18} />
                  <span>{t.announcements.supervisorTargetNote}</span>
                </div>
              ) : (
                <label>
                  {t.announcements.targetLabel}
                  <select
                    value={form.target}
                    onChange={(event) => setForm((current) => ({ ...current, target: event.target.value }))}
                  >
                    {managerTargetValues.map((value) => (
                      <option value={value} key={value}>
                        {t.announcements.managerTargetOptions[value]}
                      </option>
                    ))}
                  </select>
                </label>
              )}

              <label>
                {t.announcements.bodyLabel}
                <textarea
                  value={form.body}
                  onChange={(event) => setForm((current) => ({ ...current, body: event.target.value }))}
                  placeholder={t.announcements.bodyPlaceholder}
                  rows={6}
                  required
                />
              </label>

              {error && <div className="form-message error">{error}</div>}
              <button className="primary-button announcement-submit" type="submit" disabled={saving}>
                <Send size={17} />
                <span>{saving ? t.announcements.sending : t.announcements.send}</span>
              </button>
            </form>
          </section>
        )}

        <section className="panel announcement-list-panel">
          <div className="panel-heading">
            <div>
              <h2>{canCreate ? t.announcements.visibleTitle : t.announcements.inboxTitle}</h2>
              <small className="announcement-heading-note">
                {t.announcements.listNote}
              </small>
            </div>
            <span className="panel-badge secondary">
              {fmt(t.announcements.countLabel, { count: announcements.length })}
            </span>
          </div>
          <div className="announcement-list">
            {loading && (
              <div className="skeleton-wrapper" style={{ padding: 0 }}>
                {Array.from({ length: 5 }).map((_, idx) => (
                  <div key={`skeleton-${idx}`} className="skeleton-card" style={{ height: '90px', marginBottom: '16px' }}>
                    <div className="skeleton skeleton-title" style={{ width: '60%', height: '20px', margin: 0 }} />
                    <div className="skeleton skeleton-text" style={{ width: '90%' }} />
                    <div className="skeleton skeleton-text" style={{ width: '70%' }} />
                  </div>
                ))}
              </div>
            )}
            {!loading && announcements.length === 0 && (
              <div className="announcement-empty">{t.announcements.empty}</div>
            )}
            {!loading && announcements.map((item) => (
              <article className="announcement-item" key={item.id}>
                <div className="announcement-item-head">
                  <div className="announcement-badges">
                    <span className={`announcement-target ${item.target}`}>
                      {t.announcements.targetLabels[item.target] || item.target}
                    </span>
                    <span className="announcement-author">
                      {t.announcements.from}: {item.created_by_name || "-"}
                      {announcementLocation(item, t) !== t.announcements.general ? ` (${announcementLocation(item, t)})` : ""}
                    </span>
                  </div>
                  <span className="announcement-time">
                    <BellRing size={15} />
                    {formatDateTime(item.created_at)}
                  </span>
                </div>
                <div className="announcement-content">
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </div>
              </article>
            ))}
          </div>
          <div className="announcement-list-footer">
            <span>{fmt(t.announcements.totalLabel, { count: announcements.length })}</span>
          </div>
        </section>
      </div>
    </section>
  );
}
