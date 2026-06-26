import { useEffect, useMemo, useState } from "react";
import { Building2, KeyRound, MapPin, ShieldCheck, UserPlus, Users } from "lucide-react";

import api from "../api/client.js";
import { useAuth } from "../auth/AuthContext.jsx";
import {
  ROLE_ADMIN,
  ROLE_MANAGER,
  ROLE_OPERATOR,
  ROLE_SUPERVISOR,
  creatableRolesFor,
  defaultCreatableRole,
  roleLabel
} from "../auth/roles.js";
import StatCard from "../components/StatCard.jsx";
import { useI18n } from "../localization/i18n.jsx";

const PAGE_SIZE = 30;

function createEmptyForm(user, role = defaultCreatableRole(user)) {
  return {
    username: "",
    password: "",
    first_name: "",
    last_name: "",
    role,
    region_id: "",
    branch_id: "",
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

function resolvePageTitle(t, user, allowedRoles) {
  if (user?.role === ROLE_ADMIN || user?.is_superuser) return t.operators.title;
  if (allowedRoles.includes(ROLE_MANAGER)) return t.operators.managersTitle;
  if (allowedRoles.includes(ROLE_SUPERVISOR)) return t.operators.teamTitle;
  return t.operators.operatorsTitle;
}

export default function OperatorsPage() {
  const { user } = useAuth();
  const { t, fmt } = useI18n();
  const [operators, setOperators] = useState([]);
  const [orgOptions, setOrgOptions] = useState({ roles: creatableRolesFor(user), regions: [], branches: [] });
  const [form, setForm] = useState(() => createEmptyForm(user));
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ count: 0, next: null, previous: null });

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
    api.get("/operators/", { params: { page } }).then((res) => {
      const results = res.data.results || res.data || [];
      setOperators(results);
      setMeta({
        count: res.data.count ?? results.length,
        next: res.data.next || null,
        previous: res.data.previous || null
      });
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
  }, [page]);

  useEffect(() => {
    loadOrganizationOptions();
  }, []);

  function handleRoleChange(role) {
    setForm((current) => ({
      ...current,
      role,
      region_id: "",
      branch_id: ""
    }));
  }

  function handleRegionChange(regionId) {
    setForm((current) => {
      const branch = orgOptions.branches.find((item) => String(item.id) === String(current.branch_id));
      return {
        ...current,
        region_id: regionId,
        branch_id: branch && String(branch.region) === String(regionId) ? current.branch_id : ""
      };
    });
  }

  function handleBranchChange(branchId) {
    const branch = orgOptions.branches.find((item) => String(item.id) === String(branchId));
    setForm((current) => ({
      ...current,
      branch_id: branchId,
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
      if (page !== 1) {
        setPage(1);
      } else {
        loadOperators();
      }
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
  const visibleStatRoles = [ROLE_ADMIN, ROLE_MANAGER, ROLE_SUPERVISOR, ROLE_OPERATOR].filter(
    (role) => allowedRoles.includes(role) || roleCounts[role]
  );
  const pageTitle = resolvePageTitle(t, user, allowedRoles);
  const createTitle = allowedRoles.includes(ROLE_MANAGER)
    ? t.operators.createManager
    : allowedRoles.includes(ROLE_SUPERVISOR)
      ? t.operators.createTeamUser
      : t.operators.createOperator;
  const fixedCreatableRole = allowedRoles.length === 1 ? allowedRoles[0] : null;
  const rangeStart = meta.count === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min((page - 1) * PAGE_SIZE + operators.length, meta.count);

  return (
    <section className="page-stack operators-page">
      <div className="operators-grid">
        <section className="panel operators-table-panel">
          <div className="panel-heading">
            <h2>{pageTitle}</h2>
            <span className="panel-badge secondary">{fmt(t.operators.usersCount, { count: meta.count })}</span>
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
                    <td colSpan="7" style={{ textAlign: "center", color: "var(--muted)", padding: "32px" }}>
                      {t.operators.noUsers}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="pagination operators-pagination">
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

        <aside className="operators-sidebar">
          <div className="operators-stats">
            <StatCard label={t.operators.totalUsers} value={meta.count} icon={Users} tone="purple" />
            <StatCard label={t.common.active} value={activeCount} icon={ShieldCheck} tone="green" />
            {visibleStatRoles.map((role) => (
              <StatCard
                key={role}
                label={roleLabel(t, role)}
                value={roleCounts[role] || 0}
                icon={
                  role === ROLE_ADMIN
                    ? ShieldCheck
                    : role === ROLE_MANAGER
                      ? Building2
                      : role === ROLE_SUPERVISOR
                        ? KeyRound
                        : UserPlus
                }
                tone={
                  role === ROLE_ADMIN
                    ? "amber"
                    : role === ROLE_MANAGER
                      ? "teal"
                      : role === ROLE_SUPERVISOR
                        ? "green"
                        : "blue"
                }
              />
            ))}
          </div>

          <section className="panel operator-create-panel">
            <div className="panel-heading">
              <h2>{createTitle}</h2>
            </div>

            <form className="operator-form" onSubmit={handleSubmit}>
              {fixedCreatableRole ? (
                <div className="operator-scope-note">
                  <UserPlus size={15} />
                  <span>{t.common.role}: {roleLabel(t, fixedCreatableRole)}</span>
                </div>
              ) : (
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
              )}

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
