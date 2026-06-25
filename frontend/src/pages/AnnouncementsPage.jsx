import { useEffect, useState } from "react";
import {
  BellRing,
  MessageSquarePlus,
  Send,
  UserCheck
} from "lucide-react";

import api from "../api/client.js";
import { useAuth } from "../auth/AuthContext.jsx";
import {
  ROLE_OPERATOR,
  ROLE_SUPERVISOR,
  effectiveRole,
  hasRoleAtLeast
} from "../auth/roles.js";
import { formatDateTime } from "../utils/format.js";

const targetLabels = {
  all: "Hammaga",
  supervisor: "Supervisorlarga",
  operator: "Operatorlarga"
};

const managerTargetOptions = [
  { value: "all", label: "Hammaga" },
  { value: "supervisor", label: "Faqat supervisorlarga" }
];

function formatApiError(data, fallback) {
  if (!data) return fallback;
  if (typeof data === "string") return fallback;
  if (data.detail) return data.detail;
  return fallback;
}

function announcementLocation(item) {
  const parts = [item.assigned_region_name, item.assigned_branch_name].filter(Boolean);
  return parts.length ? parts.join(" / ") : "Umumiy";
}

export default function AnnouncementsPage() {
  const { user } = useAuth();
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
      setError(formatApiError(err.response?.data, "E'lon yaratishda xatolik bor."));
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="page-stack operator-page operator-announcements-page">
      <div className="help-hero-banner" style={{ minHeight: "200px", marginBottom: "20px", background: "radial-gradient(circle at 90% 14%, rgba(255, 255, 255, 0.15), transparent 40%), linear-gradient(135deg, #0284c7 0%, #4f46e5 100%)" }}>
        <div className="help-hero-content">
          <span className="help-hero-badge"><BellRing size={16}/> Tizim e'lonlari</span>
          <h1>So'nggi yangiliklar va bildirishnomalar</h1>
          <p>Tizimdagi so'nggi o'zgarishlar, qo'shilgan yangi imkoniyatlar va muhim xabarlardan doim xabardor bo'ling.</p>
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
                <span className="panel-kicker">Yangi xabar</span>
                <h2>E'lon yozish</h2>
              </div>
              <MessageSquarePlus size={20} />
            </div>
            <form className="announcement-form" onSubmit={handleSubmit}>
              <label>
                Sarlavha
                <input
                  value={form.title}
                  onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                  placeholder="Masalan: Bugungi reestr nazorati"
                  maxLength={180}
                  required
                />
              </label>

              {activeRole === ROLE_SUPERVISOR ? (
                <div className="announcement-fixed-target">
                  <UserCheck size={18} />
                  <span>Supervisor e'loni faqat o'z hududidagi operatorlarga boradi.</span>
                </div>
              ) : (
                <label>
                  Kimga yuboriladi
                  <select
                    value={form.target}
                    onChange={(event) => setForm((current) => ({ ...current, target: event.target.value }))}
                  >
                    {managerTargetOptions.map((option) => (
                      <option value={option.value} key={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              )}

              <label>
                Xabar matni
                <textarea
                  value={form.body}
                  onChange={(event) => setForm((current) => ({ ...current, body: event.target.value }))}
                  placeholder="E'lon matnini kiriting"
                  rows={6}
                  required
                />
              </label>

              {error && <div className="form-message error">{error}</div>}
              <button className="primary-button announcement-submit" type="submit" disabled={saving}>
                <Send size={17} />
                <span>{saving ? "Yuborilmoqda..." : "E'lon yuborish"}</span>
              </button>
            </form>
          </section>
        )}

        <section className="panel announcement-list-panel">
          <div className="panel-heading">
            <div>
              <span className="panel-kicker">Xabarlar</span>
              <h2>{canCreate ? "Yuborilgan va ko'rinadigan e'lonlar" : "Menga kelgan e'lonlar"}</h2>
              <small className="announcement-heading-note">
                Kimdan kelgani, qachon yuborilgani va kimga tegishli ekani shu yerda ko'rinadi.
              </small>
            </div>
            <span className="panel-badge secondary">{announcements.length} ta e'lon</span>
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
              <div className="announcement-empty">Hozircha e'lon yo'q.</div>
            )}
            {!loading && announcements.map((item) => (
              <article className="announcement-item" key={item.id}>
                <div className="announcement-item-head">
                  <div className="announcement-badges">
                    <span className={`announcement-target ${item.target}`}>{targetLabels[item.target] || item.target}</span>
                    <span className="announcement-author">
                      Kimdan: {item.created_by_name || "-"} 
                      {announcementLocation(item) !== "Umumiy" ? ` (${announcementLocation(item)})` : ""}
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
            <span>Jami: {announcements.length} ta e'lon</span>
          </div>
        </section>
      </div>
    </section>
  );
}
