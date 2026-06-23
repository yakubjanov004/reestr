import { useEffect, useState } from "react";
import { KeyRound, ShieldCheck, UserPlus, Users, X } from "lucide-react";

import api from "../api/client.js";
import PageHero from "../components/PageHero.jsx";
import { useI18n } from "../localization/i18n.jsx";

const emptyForm = {
  username: "",
  password: "",
  first_name: "",
  last_name: "",
  email: "",
  role: "operator",
  is_active: true
};

function formatApiError(data, fallback) {
  if (!data) return fallback;
  if (typeof data === "string") return fallback;
  if (data.detail) return fallback;
  return Object.entries(data)
    .map(([field, messages]) => {
      const text = Array.isArray(messages) ? messages.join(" ") : String(messages);
      return `${field}: ${text}`;
    })
    .join(" ");
}

export default function OperatorsPage() {
  const { t, fmt } = useI18n();
  const [operators, setOperators] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [passwordForm, setPasswordForm] = useState({ operatorId: null, password: "" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function loadOperators() {
    api.get("/operators/").then((res) => {
      setOperators(res.data.results || res.data || []);
    });
  }

  useEffect(() => { loadOperators(); }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      await api.post("/operators/", form);
      setForm(emptyForm);
      loadOperators();
    } catch (err) {
      setError(formatApiError(err.response?.data, t.operators.createError));
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(operator) {
    await api.patch(`/operators/${operator.id}/`, { is_active: !operator.is_active });
    loadOperators();
  }

  async function handlePasswordSubmit(event, operator) {
    event.preventDefault();
    if (passwordForm.password.length < 8) {
      setError(t.operators.passwordMinError);
      return;
    }
    setSaving(true);
    setError("");
    try {
      await api.patch(`/operators/${operator.id}/`, { password: passwordForm.password });
      setPasswordForm({ operatorId: null, password: "" });
      loadOperators();
    } catch (err) {
      setError(formatApiError(err.response?.data, t.operators.genericError));
    } finally {
      setSaving(false);
    }
  }

  const activeCount = operators.filter((operator) => operator.is_active).length;
  const managerCount = operators.filter((operator) => operator.role === "manager").length;

  return (
    <section className="page-stack operators-page">
      <PageHero
        kicker={t.operators.heroKicker}
        title={t.operators.title}
        description={t.operators.description}
        icon={Users}
        stats={[
          { label: t.operators.totalUsers, value: operators.length, icon: Users },
          { label: t.common.active, value: activeCount, icon: ShieldCheck },
          { label: t.roles.manager, value: managerCount, icon: KeyRound },
          { label: t.roles.operator, value: operators.length - managerCount, icon: UserPlus }
        ]}
      />

      <div className="operators-grid">
        {/* ── Create user form ── */}
        <section className="panel operator-create-panel">
          <div className="panel-heading">
            <h2>{t.operators.createUser}</h2>
          </div>

          <form className="operator-form" onSubmit={handleSubmit}>
            <label>
              {t.common.role}
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                <option value="operator">{t.roles.operator}</option>
                <option value="manager">{t.roles.manager}</option>
              </select>
            </label>
            <label>
              {t.common.login}
              <input
                placeholder={t.operators.usernamePlaceholder}
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
              />
            </label>
            <label>
              {t.common.password}
              <input
                type="password"
                placeholder={t.operators.minPassword}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                minLength={8}
                required
              />
            </label>
            <label>
              {t.common.firstName}
              <input
                placeholder={t.common.firstName}
                value={form.first_name}
                onChange={(e) => setForm({ ...form, first_name: e.target.value })}
              />
            </label>
            <label>
              {t.common.lastName}
              <input
                placeholder={t.common.lastName}
                value={form.last_name}
                onChange={(e) => setForm({ ...form, last_name: e.target.value })}
              />
            </label>
            <label>
              Email
              <input
                type="email"
                placeholder="email@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </label>

            {error && <div className="form-error">⚠ {error}</div>}

            <button className="primary-button icon-button" type="submit" disabled={saving}>
              <UserPlus size={16} />
              <span>{saving ? t.common.saving : t.common.create}</span>
            </button>
          </form>
        </section>

        {/* ── Operators table ── */}
        <section className="panel">
          <div className="panel-heading">
            <h2>{t.operators.title}</h2>
            <span className="panel-badge secondary">{fmt(t.operators.usersCount, { count: operators.length })}</span>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Login</th>
                  <th>{t.common.role}</th>
                  <th>{t.common.fullName}</th>
                  <th>Email</th>
                  <th>{t.common.status}</th>
                  <th>{t.common.action}</th>
                </tr>
              </thead>
              <tbody>
                {operators.map((op) => (
                  <tr key={op.id} data-blocked={!op.is_active}>
                    <td style={{ fontWeight: 600 }}>{op.username}</td>
                    <td>
                      <span className={`badge ${op.role === "manager" ? "badge-manager" : "badge-operator"}`}>
                        {op.role === "manager" ? t.roles.manager : t.roles.operator}
                      </span>
                    </td>
                    <td>{op.full_name}</td>
                    <td>{op.email}</td>
                    <td>
                      <span className={`badge ${op.is_active ? "badge-active" : "badge-blocked"}`}>
                        <span className="status-dot" />
                        {op.is_active ? t.common.active : t.common.blocked}
                      </span>
                    </td>
                    <td>
                      <div className="row-actions">
                        <button
                          className={op.is_active ? "btn-block" : "btn-activate"}
                          type="button"
                          onClick={() => toggleActive(op)}
                        >
                          {op.is_active ? t.common.block : t.common.activate}
                        </button>

                        {passwordForm.operatorId === op.id ? (
                          <form
                            className="inline-password"
                            onSubmit={(e) => handlePasswordSubmit(e, op)}
                          >
                            <input
                              type="password"
                              minLength={8}
                              placeholder={t.operators.newPassword}
                              value={passwordForm.password}
                              onChange={(e) =>
                                setPasswordForm({ operatorId: op.id, password: e.target.value })
                              }
                            />
                            <button className="btn-save" type="submit" disabled={saving}>
                              {t.common.save}
                            </button>
                            <button
                              className="btn-cancel"
                              type="button"
                              title={t.common.cancel}
                              onClick={() => setPasswordForm({ operatorId: null, password: "" })}
                            >
                              <X size={15} />
                            </button>
                          </form>
                        ) : (
                          <button
                            className="btn-password"
                            type="button"
                            onClick={() => setPasswordForm({ operatorId: op.id, password: "" })}
                          >
                            <KeyRound size={14} />
                            <span>{t.common.password}</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {operators.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ textAlign: "center", color: "var(--muted)", padding: "32px" }}>
                      {t.operators.noUsers}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </section>
  );
}
