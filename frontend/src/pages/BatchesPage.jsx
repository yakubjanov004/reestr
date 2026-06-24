import { useEffect, useState } from "react";
import { FileSpreadsheet, History, Upload, Users } from "lucide-react";

import api from "../api/client.js";
import PageHero from "../components/PageHero.jsx";
import SourceTypeTabs from "../components/SourceTypeTabs.jsx";
import { useI18n } from "../localization/i18n.jsx";
import { formatDateTime } from "../utils/format.js";

const emptyFilters = {
  date_from: "",
  date_to: "",
  uploaded_by: "",
  assigned_region: "",
  assigned_branch: ""
};

export default function BatchesPage() {
  const { t } = useI18n();
  const [batches, setBatches] = useState([]);
  const [sourceType, setSourceType] = useState("");
  const [filters, setFilters] = useState(emptyFilters);
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

  return (
    <section className="page-stack">
      <PageHero
        kicker={t.batches.heroKicker}
        title={t.batches.title}
        description={t.batches.description}
        icon={History}
        stats={[
          { label: t.batches.totalBatch, value: meta.count, icon: Upload },
          { label: t.batches.currentPage, value: batches.length, icon: FileSpreadsheet },
          { label: t.common.operators, value: operators.length, icon: Users },
          { label: t.source.sourceType, value: sourceType ? "1" : "2", icon: History }
        ]}
      />

      <section className="panel">
        <div className="panel-heading split">
          <h2>{t.batches.tableTitle}</h2>
          <SourceTypeTabs value={sourceType} onChange={handleSourceType} includeAll />
        </div>

        <div className="advanced-filters compact-filters">
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
          {operators.length > 0 && (
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
          {regions.length > 0 && (
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
          {branches.length > 0 && (
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

        <div className="table-wrap">
          <table>
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
                  <td style={{ fontWeight: 600, maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {batch.original_filename}
                  </td>
                  <td>
                    <span className={`source-pill ${batch.source_type}`}>
                      {batch.source_type === "mobile" ? `📱 ${t.source.mobileShort}` : `🌐 ${t.source.internetShort}`}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600 }}>{batch.uploaded_by_username}</td>
                  <td>{batch.assigned_region_name || "-"}</td>
                  <td>{batch.assigned_branch_name || "-"}</td>
                  <td style={{ fontVariantNumeric: 'tabular-nums' }}>{batch.rows_in_file}</td>
                  <td>
                    <span style={{ color: 'var(--blue-mid)', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                      {batch.imported_count}
                    </span>
                  </td>
                  <td style={{ color: 'var(--muted)', fontVariantNumeric: 'tabular-nums' }}>{batch.duplicate_count}</td>
                  <td style={{ color: 'var(--muted)', fontVariantNumeric: 'tabular-nums' }}>{batch.skipped_count}</td>
                  <td>
                    {batch.import_error_count > 0 ? (
                      <span className="batch-status-error">
                        ⚠ {batch.import_error_count} {t.common.itemSuffix} {t.batches.errors}
                      </span>
                    ) : (
                      <span className="batch-status-done">✓ {t.common.ok}</span>
                    )}
                  </td>
                  <td style={{ color: 'var(--muted)', fontSize: '12.5px' }}>{formatDateTime(batch.created_at)}</td>
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
