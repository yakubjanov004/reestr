import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import api from "../../api/client.js";
import { useAuth } from "../../auth/AuthContext.jsx";
import {
  ROLE_ADMIN,
  ROLE_MANAGER,
  ROLE_OPERATOR,
  ROLE_SUPERVISOR,
  effectiveRole
} from "../../auth/roles.js";
import SourceTypeTabs from "../../components/SourceTypeTabs.jsx";
import { useI18n } from "../../localization/i18n.jsx";
import { formatDateTime } from "../../utils/format.js";
import { sourceLabel } from "./recordUtils.js";

const PAGE_SIZE = 30;

const emptyFilters = {
  date_from: "",
  date_to: "",
  uploaded_by: "",
  assigned_region: "",
  assigned_branch: ""
};

function resolveBatchesTitle(t, role) {
  if (role === ROLE_ADMIN) return t.batches.adminTitle;
  if (role === ROLE_MANAGER) return t.batches.managerTitle;
  if (role === ROLE_SUPERVISOR) return t.batches.supervisorTitle;
  return t.batches.operatorTitle;
}

export default function BatchesPage() {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { t } = useI18n();
  const currentRole = effectiveRole(user) || ROLE_OPERATOR;
  const canUseTeamFilters = currentRole !== ROLE_OPERATOR;
  const pageTitle = resolveBatchesTitle(t, currentRole);
  const [batches, setBatches] = useState([]);
  const [sourceType, setSourceType] = useState("");
  const [filters, setFilters] = useState({
    ...emptyFilters,
    date_from: searchParams.get("date_from") || "",
    date_to: searchParams.get("date_to") || "",
    uploaded_by: searchParams.get("uploaded_by") || "",
    assigned_region: searchParams.get("assigned_region") || "",
    assigned_branch: searchParams.get("assigned_branch") || ""
  });
  const [operators, setOperators] = useState([]);
  const [regions, setRegions] = useState([]);
  const [branches, setBranches] = useState([]);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ count: 0, next: null, previous: null });

  useEffect(() => {
    api.get("/records/filter-options/").then((response) => {
      setOperators(response.data.operators || []);
      setRegions(response.data.organization_regions || []);
      setBranches(response.data.branches || []);
    });
  }, []);

  useEffect(() => {
    const params = {
      page,
      source_type: sourceType || undefined,
      ...Object.fromEntries(Object.entries(filters).filter(([, value]) => value))
    };
    api
      .get("/records/batches/", { params })
      .then((response) => {
        setBatches(response.data.results || []);
        setMeta({
          count: response.data.count || 0,
          next: response.data.next,
          previous: response.data.previous
        });
      });
  }, [page, sourceType, filters]);

  function handleSourceType(value) {
    setSourceType(value);
    setPage(1);
  }

  function handleFilter(field, value) {
    setFilters((current) => ({
      ...current,
      [field]: value,
      ...(field === "assigned_region" ? { assigned_branch: "" } : {})
    }));
    setPage(1);
  }

  const branchOptions = branches.filter(
    (branch) => !filters.assigned_region || String(branch.region) === String(filters.assigned_region)
  );
  const rangeStart = meta.count === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min((page - 1) * PAGE_SIZE + batches.length, meta.count);

  return (
    <section className="page-stack batches-page">
      <section className="panel batches-table-panel">
        <div className="panel-heading split batches-filter-heading">
          <h2>{pageTitle}</h2>
          <SourceTypeTabs value={sourceType} onChange={handleSourceType} includeAll />
        </div>

        <div className="advanced-filters batches-advanced-filters">
          <label>
            {t.batches.from}
            <input
              type="date"
              value={filters.date_from}
              onChange={(event) => handleFilter("date_from", event.target.value)}
            />
          </label>
          <label>
            {t.batches.to}
            <input
              type="date"
              value={filters.date_to}
              onChange={(event) => handleFilter("date_to", event.target.value)}
            />
          </label>
          {canUseTeamFilters && operators.length > 0 && (
            <label>
              {t.common.operator}
              <select
                value={filters.uploaded_by}
                onChange={(event) => handleFilter("uploaded_by", event.target.value)}
              >
                <option value="">{t.common.all}</option>
                {operators.map((operator) => (
                  <option value={operator.id} key={operator.id}>
                    {operator.full_name}
                  </option>
                ))}
              </select>
            </label>
          )}
          {canUseTeamFilters && regions.length > 0 && (
            <label>
              {t.common.region}
              <select
                value={filters.assigned_region}
                onChange={(event) => handleFilter("assigned_region", event.target.value)}
              >
                <option value="">{t.common.all}</option>
                {regions.map((region) => (
                  <option value={region.id} key={region.id}>
                    {region.name}
                  </option>
                ))}
              </select>
            </label>
          )}
          {canUseTeamFilters && branches.length > 0 && (
            <label>
              {t.common.branch}
              <select
                value={filters.assigned_branch}
                onChange={(event) => handleFilter("assigned_branch", event.target.value)}
              >
                <option value="">{t.common.all}</option>
                {branchOptions.map((branch) => (
                  <option value={branch.id} key={branch.id}>
                    {branch.region_name ? `${branch.region_name} / ${branch.name}` : branch.name}
                  </option>
                ))}
              </select>
            </label>
          )}
          <button
            className="batches-clear-filter"
            type="button"
            onClick={() => {
              setFilters(emptyFilters);
              setSourceType("");
              setPage(1);
            }}
          >
            {t.common.clear}
          </button>
        </div>

        <div className="table-wrap batches-table-wrap">
          <table className="batches-table">
            <thead>
              <tr>
                <th>{t.common.file}</th>
                <th>{t.common.type}</th>
                <th>{t.common.operator}</th>
                <th>{t.common.region}</th>
                <th>{t.common.branch}</th>
                <th>{t.batches.rows}</th>
                <th>{t.batches.imported}</th>
                <th>{t.batches.duplicate}</th>
                <th>{t.batches.skipped}</th>
                <th>{t.batches.issue}</th>
                <th>{t.common.date}</th>
              </tr>
            </thead>
            <tbody>
              {batches.map((batch) => (
                <tr key={batch.id}>
                  <td data-label={t.common.file} style={{ fontWeight: 600, maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {batch.original_filename}
                  </td>
                  <td data-label={t.common.type}>
                    <span className={`source-pill ${batch.source_type}`}>
                      {sourceLabel(batch.source_type, t)}
                    </span>
                  </td>
                  <td data-label={t.common.operator} style={{ fontWeight: 600 }}>{batch.uploaded_by_username}</td>
                  <td data-label={t.common.region}>{batch.assigned_region_name || "-"}</td>
                  <td data-label={t.common.branch}>{batch.assigned_branch_name || "-"}</td>
                  <td data-label={t.batches.rows} style={{ fontVariantNumeric: 'tabular-nums' }}>{batch.rows_in_file}</td>
                  <td data-label={t.batches.imported}>
                    <span style={{ color: 'var(--blue-mid)', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                      {batch.imported_count}
                    </span>
                  </td>
                  <td data-label={t.batches.duplicate} style={{ color: 'var(--muted)', fontVariantNumeric: 'tabular-nums' }}>{batch.duplicate_count}</td>
                  <td data-label={t.batches.skipped} style={{ color: 'var(--muted)', fontVariantNumeric: 'tabular-nums' }}>{batch.skipped_count}</td>
                  <td data-label={t.batches.issue}>
                    {batch.import_error_count > 0 ? (
                      <span className="batch-status-error">
                        {batch.import_error_count} {t.common.itemSuffix} {t.batches.errors}
                      </span>
                    ) : (
                      <span className="batch-status-done">{t.common.ok}</span>
                    )}
                  </td>
                  <td data-label={t.common.date} style={{ color: 'var(--muted)', fontSize: '12.5px' }}>{formatDateTime(batch.created_at)}</td>
                </tr>
              ))}
              {batches.length === 0 && (
                <tr>
                  <td colSpan="11">{t.batches.noUploads}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="pagination batches-pagination">
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
