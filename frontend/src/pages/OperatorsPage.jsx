import { useEffect, useMemo, useState } from "react";
import { Building2, KeyRound, MapPin, ShieldCheck, UserPlus, Users } from "lucide-react";

import api from "../api/client.js";
import { useAuth } from "../auth/AuthContext.jsx";
import {
  ROLE_OPERATOR,
  ROLE_SUPERVISOR,
  creatableRolesFor,
  defaultCreatableRole,
  roleLabel
} from "../auth/roles.js";
import StatCard from "../components/StatCard.jsx";
import { useI18n } from "../localization/i18n.jsx";

function createEmptyForm(user, role = defaultCreatableRole(user)) {
  return {
    username: "",
    password: "",
    first_name: "",
    last_name: "",
    email: "",
    role,
    region_id: "",
    branch_id: "",
    region_name: "",
    branch_name: "",
    is_active: true
  };
}

function formatApiError(data, fallback) {
  if (!data) return fallback;
  if (typeof data === "string") return fallback;
  if (data.detail) return data.detail;
  return Object.entries(data)
    .map(([field, messages]) => {
      const text = Array.isArray(messages) ? messages.join(" ") : String(messages);
      return `${field}: ${text}`;
    })
    .join(" ");
}

function compactPayload(form) {
  return Object.fromEntries(
    Object.entries(form).filter(([, value]) => value !== "" && value !== null && value !== undefined)
  );
}

export default function OperatorsPage() {
  const { user } = useAuth();
  const { t, fmt } = useI18n();
  const [operators, setOperators] = useState([]);
  const [orgOptions, setOrgOptions] = useState({ roles: creatableRolesFor(user), regions: [], branches: [] });
  const [form, setForm] = useState(() => createEmptyForm(user));
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const allowedRoles = orgOptions.roles?.length ? orgOptions.roles : creatableRolesFor(user);
  const selectedRegionId = form.region_id ? String(form.region_id) : "";
  const availableBranches = useMemo(
    () =>
      orgOptions.branches.filter(
        (branch) => !selectedRegionId || String(branch.region) === selectedRegionId
      ),
    [orgOptions.branches, selectedRegionId]
  );
  const needsRegion = form.role === ROLE_SUPERVISOR || (form.role === ROLE_OPERATOR && user?.role !== ROLE_SUPERVISOR);
  const needsBranch = form.role === ROLE_OPERATOR;

  function loadOperators() {
    api.get("/operators/").then((res) => {
      setOperators(res.data.results || res.data || []);
    });
  }

  function loadOrganizationOptions() {
    api.get("/organization/options/").then((response) => {
      const nextOptions = {
        roles: response.data.roles || [],
        regions: response.data.regions || [],
        branches: response.data.branches || []
      };
      setOrgOptions(nextOptions);
      setForm((current) => {
        const nextRole = nextOptions.roles.includes(current.role)
          ? current.role
          : nextOptions.roles[0] || defaultCreatableRole(user);
        return { ...current, role: nextRole };
      });
    });
  }

  useEffect(() => {
    loadOperators();
    loadOrganizationOptions();
  }, []);

  function handleRoleChange(role) {
    setForm((current) => ({
      ...current,
      role,
      region_id: "",
      branch_id: "",
      region_name: "",
      branch_name: ""
    }));
  }

  function handleRegionChange(regionId) {
    setForm((current) => {
      const branch = orgOptions.branches.find((item) => String(item.id) === String(current.branch_id));
      return {
        ...current,
        region_id: regionId,
        region_name: "",
        branch_id: branch && String(branch.region) === String(regionId) ? current.branch_id : ""
      };
    });
  }

  function handleBranchChange(branchId) {
    const branch = orgOptions.branches.find((item) => String(item.id) === String(branchId));
    setForm((current) => ({
      ...current,
      branch_id: branchId,
      branch_name: "",
      region_name: "",
      region_id: branch?.region ? String(branch.region) : current.region_id
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      await api.post("/operators/", compactPayload(form));
      const nextRole = allowedRoles.includes(form.role) ? form.role : allowedRoles[0];
      setForm(createEmptyForm(user, nextRole));
      loadOperators();
      loadOrganizationOptions();
    } catch (err) {
      setError(formatApiError(err.response?.data, t.operators.createError));
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(operator) {
    if (operator.is_active) {
      if (!window.confirm("Haqiqatdan ham ushbu foydalanuvchini bloklamoqchimisiz?")) {
        return;
      }
    }
    await api.patch(`/operators/${operator.id}/`, { is_active: !operator.is_active });
    loadOperators();
  }

  const activeCount = operators.filter((operator) => operator.is_active).length;
  const roleCounts = operators.reduce((acc, operator) => {
    acc[operator.role] = (acc[operator.role] || 0) + 1;
    return acc;
  }, {});

  return (
    <section className="page-stack operators-page">
      <div className="operators-grid">
        <section className="panel operators-table-panel">
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
                  <th>{t.common.region}</th>
                  <th>{t.common.branch}</th>
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
                      <span className={`badge badge-${op.role}`}>
                        {roleLabel(t, op.role)}
                      </span>
                    </td>
                    <td>{op.full_name}</td>
                    <td>{op.region?.name || "-"}</td>
                    <td>{op.branch?.name || "-"}</td>
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
                      </div>
                    </td>
                  </tr>
                ))}
                {operators.length === 0 && (
                  <tr>
                    <td colSpan="8" style={{ textAlign: "center", color: "var(--muted)", padding: "32px" }}>
                      {t.operators.noUsers}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <aside className="operators-sidebar">
          <div className="operators-stats">
            <StatCard label={t.operators.totalUsers} value={operators.length} icon={Users} />
            <StatCard label={t.common.active} value={activeCount} icon={ShieldCheck} tone="success" />
            <StatCard label={t.roles.supervisor} value={roleCounts.supervisor || 0} icon={KeyRound} tone="primary" />
            <StatCard label={t.roles.operator} value={roleCounts.operator || 0} icon={UserPlus} />
          </div>

          <section className="panel operator-create-panel">
            <div className="panel-heading">
              <h2>{t.operators.createUser}</h2>
            </div>

            <form className="operator-form" onSubmit={handleSubmit}>
              <label>
                {t.common.role}
                <select
                  value={form.role}
                  onChange={(e) => handleRoleChange(e.target.value)}
                >
                  {allowedRoles.map((role) => (
                    <option value={role} key={role}>{roleLabel(t, role)}</option>
                  ))}
                </select>
              </label>

              {needsRegion && user?.role !== ROLE_SUPERVISOR && (
                <>
                  <label>
                    {t.common.region}
                    <select
                      value={form.region_id}
                      onChange={(e) => handleRegionChange(e.target.value)}
                    >
                      <option value="">{t.operators.selectRegion}</option>
                      {orgOptions.regions.map((region) => (
                        <option value={region.id} key={region.id}>{region.name}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    {t.operators.newRegion}
                    <input
                      placeholder={t.operators.newRegionPlaceholder}
                      value={form.region_name}
                      onChange={(e) => setForm({ ...form, region_name: e.target.value, region_id: "" })}
                    />
                  </label>
                </>
              )}

              {user?.role === ROLE_SUPERVISOR && needsBranch && (
                <div className="operator-scope-note">
                  <MapPin size={15} />
                  <span>{t.common.region}: {user?.region?.name || t.common.notEntered}</span>
                </div>
              )}

              {needsBranch && (
                <>
                  <label>
                    {t.common.branch}
                    <select
                      value={form.branch_id}
                      onChange={(e) => handleBranchChange(e.target.value)}
                    >
                      <option value="">{t.operators.selectBranch}</option>
                      {availableBranches.map((branch) => (
                        <option value={branch.id} key={branch.id}>
                          {branch.region_name ? `${branch.region_name} / ${branch.name}` : branch.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    {t.operators.newBranch}
                    <input
                      placeholder={t.operators.newBranchPlaceholder}
                      value={form.branch_name}
                      onChange={(e) => setForm({ ...form, branch_name: e.target.value, branch_id: "" })}
                    />
                  </label>
                </>
              )}

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
                <Building2 size={16} />
                <span>{saving ? t.common.saving : t.common.create}</span>
              </button>
            </form>
          </section>
        </aside>
      </div>
    </section>
  );
}
