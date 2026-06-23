import { Database, Filter, ListChecks, Search, X } from "lucide-react";
import { useEffect, useState } from "react";

import api from "../api/client.js";
import PageHero from "../components/PageHero.jsx";
import SourceTypeTabs from "../components/SourceTypeTabs.jsx";
import { useI18n } from "../localization/i18n.jsx";
import { formatDateTime } from "../utils/format.js";

const columnCount = 18;
const emptyFilters = {
  date_from: "",
  date_to: "",
  uploaded_by: "",
  region: "",
  dealer: "",
  status: ""
};

function sourceLabel(sourceType, t) {
  return sourceType === "mobile" ? t.source.mobileShort : t.source.internetShort;
}

function amount(value) {
  if (value === null || value === undefined || value === "") {
    return "";
  }
  return value;
}

function hasRecordValue(record, field) {
  const value = record?.[field];
  return value !== null && value !== undefined && value !== "";
}

function detailValue(record, field, formatter, t) {
  const value = record?.[field];
  if (!hasRecordValue(record, field)) {
    return null;
  }
  const formatted = formatter ? formatter(value, t) : value;
  return formatted === "" ? null : formatted;
}

export default function RecordsPage() {
  const { t } = useI18n();
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState("");
  const [sourceType, setSourceType] = useState("");
  const [filters, setFilters] = useState(emptyFilters);
  const [filterOptions, setFilterOptions] = useState({
    regions: [],
    dealers: [],
    statuses: [],
    operators: []
  });
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ count: 0, next: null, previous: null });
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    api.get("/records/filter-options/").then((response) => {
      setFilterOptions({
        regions: response.data.regions || [],
        dealers: response.data.dealers || [],
        statuses: response.data.statuses || [],
        operators: response.data.operators || []
      });
    });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(true);
      const params = {
        search,
        page,
        source_type: sourceType || undefined,
        ...Object.fromEntries(Object.entries(filters).filter(([, value]) => value))
      };
      api
        .get("/records/", { params })
        .then((response) => {
          setRecords(response.data.results || []);
          setMeta({
            count: response.data.count || 0,
            next: response.data.next,
            previous: response.data.previous
          });
        })
        .finally(() => setLoading(false));
    }, 250);

    return () => clearTimeout(timer);
  }, [search, page, sourceType, filters]);

  function handleSearch(value) {
    setSearch(value);
    setPage(1);
  }

  function handleSourceType(value) {
    setSourceType(value);
    setPage(1);
  }

  function handleFilter(field, value) {
    setFilters((current) => ({ ...current, [field]: value }));
    setPage(1);
  }

  function clearFilters() {
    setFilters(emptyFilters);
    setSearch("");
    setSourceType("");
    setPage(1);
  }

  async function openDetail(recordId) {
    setDetailLoading(true);
    setDetail(null);
    try {
      const response = await api.get(`/records/${recordId}/`);
      setDetail(response.data);
    } finally {
      setDetailLoading(false);
    }
  }

  function closeDetail() {
    setDetail(null);
    setDetailLoading(false);
  }

  const detailSections = [
    {
      title: t.records.main,
      source: "all",
      fields: [
        ["ID", "id"],
        [t.common.type, "source_type", (value) => sourceLabel(value, t)],
        [t.records.client, "client_name"],
        [t.records.region, "region"],
        [t.records.dealer, "dealer"],
        [t.records.tradePoint, "trade_point"],
        [t.records.tariff, "tariff_plan"],
        [t.common.status, "status"],
        [t.records.identification, "identification_method"]
      ]
    },
    {
      title: t.records.docOperator,
      source: "all",
      fields: [
        [t.records.documentType, "document_type"],
        [t.records.documentNumber, "document_number"],
        [t.records.birthDate, "birth_date"],
        [t.records.excelOperator, "operator_full_name"],
        [`${t.common.operator} ${t.common.login}`, "operator_login"],
        [t.records.uploadedBy, "uploaded_by_username"],
        [t.records.payment, "payment_amount"]
      ]
    },
    {
      title: t.records.mobile,
      source: "mobile",
      fields: [
        [t.records.standard, "standard"],
        [t.records.phone, "phone_number"],
        [t.records.simCard, "sim_card_number"],
        [t.records.contractNumber, "contract_number"],
        [t.records.connectionDate, "connection_date", formatDateTime]
      ]
    },
    {
      title: t.records.internet,
      source: "internet",
      fields: [
        [t.records.technology, "technology"],
        [t.records.internetLogin, "internet_login"],
        [t.records.ipPhone, "ip_phone"],
        [t.records.accountNumber, "account_number"],
        [t.records.modemModel, "modem_model"],
        [t.records.modemSerial, "modem_serial"],
        [t.records.modemCost, "modem_cost"],
        [t.records.transfer, "transfer_type"],
        [t.records.contractDate, "contract_date", formatDateTime],
        [t.records.errorText, "error_text"],
        [t.records.requestNumber, "request_number"]
      ]
    },
    {
      title: t.records.import,
      source: "all",
      fields: [
        [t.common.file, "upload_batch_filename"],
        [t.records.filePeriodFrom, "upload_batch_period_start", formatDateTime],
        [t.records.filePeriodTo, "upload_batch_period_end", formatDateTime],
        [t.records.fileUploadedAt, "upload_batch_created_at", formatDateTime],
        [t.records.savedAt, "created_at", formatDateTime]
      ]
    }
  ];

  const visibleDetailSections = detail
    ? detailSections
        .filter((section) => section.source === "all" || section.source === detail.source_type)
        .map((section) => ({
          ...section,
          fields: section.fields
            .map(([label, field, formatter]) => ({
              label,
              field,
              value: detailValue(detail, field, formatter, t)
            }))
            .filter((item) => item.value !== null)
        }))
        .filter((section) => section.fields.length > 0)
    : [];

  return (
    <section className="page-stack">
      <PageHero
        kicker={t.records.heroKicker}
        title={t.records.title}
        description={t.records.description}
        icon={Database}
        stats={[
          { label: t.records.totalRecords, value: meta.count, icon: Database },
          { label: t.records.currentPage, value: records.length, icon: ListChecks },
          { label: t.common.operators, value: filterOptions.operators.length, icon: Filter },
          { label: t.records.columns, value: columnCount, icon: Search }
        ]}
      />

      <section className="panel">
        <div className="panel-heading split">
          <h2>{t.records.title}</h2>
          <div className="filter-bar">
            <SourceTypeTabs value={sourceType} onChange={handleSourceType} includeAll />
            <label className="search-box">
              <Search size={18} />
              <input
                placeholder={t.records.searchPlaceholder}
                value={search}
                onChange={(event) => handleSearch(event.target.value)}
              />
            </label>
          </div>
        </div>

        <div className="advanced-filters">
          <label>
            {t.records.importFrom}
            <input
              type="date"
              value={filters.date_from}
              onChange={(event) => handleFilter("date_from", event.target.value)}
            />
          </label>
          <label>
            {t.records.importTo}
            <input
              type="date"
              value={filters.date_to}
              onChange={(event) => handleFilter("date_to", event.target.value)}
            />
          </label>
          {filterOptions.operators.length > 0 && (
            <label>
              {t.common.operator}
              <select
                value={filters.uploaded_by}
                onChange={(event) => handleFilter("uploaded_by", event.target.value)}
              >
                <option value="">{t.common.all}</option>
                {filterOptions.operators.map((operator) => (
                  <option value={operator.id} key={operator.id}>
                    {operator.full_name}
                  </option>
                ))}
              </select>
            </label>
          )}
          <label>
            {t.records.region}
            <select
              value={filters.region}
              onChange={(event) => handleFilter("region", event.target.value)}
            >
              <option value="">{t.common.all}</option>
              {filterOptions.regions.map((region) => (
                <option value={region} key={region}>
                  {region}
                </option>
              ))}
            </select>
          </label>
          <label>
            {t.records.dealer}
            <select
              value={filters.dealer}
              onChange={(event) => handleFilter("dealer", event.target.value)}
            >
              <option value="">{t.common.all}</option>
              {filterOptions.dealers.map((dealer) => (
                <option value={dealer} key={dealer}>
                  {dealer}
                </option>
              ))}
            </select>
          </label>
          <label>
            {t.common.status}
            <select
              value={filters.status}
              onChange={(event) => handleFilter("status", event.target.value)}
            >
              <option value="">{t.common.all}</option>
              {filterOptions.statuses.map((status) => (
                <option value={status} key={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>
          <button type="button" onClick={clearFilters}>
            {t.common.clear}
          </button>
        </div>

        <div className="table-wrap">
          <table className="records-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>{t.records.client}</th>
                <th>{t.common.type}</th>
                <th>{t.records.region}</th>
                <th>{t.records.dealer}</th>
                <th>{t.records.phoneLogin}</th>
                <th>{t.records.tariff}</th>
                <th>{t.common.status}</th>
                <th>{t.records.identification}</th>
                <th>{t.records.excelOperator}</th>
                <th>{t.records.payment}</th>
                <th>{t.records.connectionDate}</th>
                <th>{t.records.modem}</th>
                <th>{t.records.modemCost}</th>
                <th>{t.records.transfer}</th>
                <th>{t.records.request}</th>
                <th>{t.records.uploadedBy}</th>
                <th>{t.records.import}</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={columnCount}>{t.common.loading}</td>
                </tr>
              )}
              {!loading &&
                records.map((record) => (
                  <tr
                    className="clickable-row"
                    key={record.id}
                    tabIndex={0}
                    onClick={() => openDetail(record.id)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        openDetail(record.id);
                      }
                    }}
                  >
                    <td>{record.id}</td>
                    <td>{record.client_name}</td>
                    <td>{sourceLabel(record.source_type, t)}</td>
                    <td>{record.region}</td>
                    <td>{record.dealer}</td>
                    <td>{record.phone_number || record.internet_login}</td>
                    <td>{record.tariff_plan}</td>
                    <td>{record.status}</td>
                    <td>{record.identification_method}</td>
                    <td>{record.operator_full_name}</td>
                    <td>{amount(record.payment_amount)}</td>
                    <td>{formatDateTime(record.connection_date || record.contract_date)}</td>
                    <td>{record.modem_model}</td>
                    <td>{amount(record.modem_cost)}</td>
                    <td>{record.transfer_type}</td>
                    <td>{record.request_number}</td>
                    <td>{record.uploaded_by_username}</td>
                    <td>{formatDateTime(record.created_at)}</td>
                  </tr>
                ))}
              {!loading && records.length === 0 && (
                <tr>
                  <td colSpan={columnCount}>{t.records.notFound}</td>
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

      {(detail || detailLoading) && (
        <div className="modal-backdrop" role="presentation" onClick={closeDetail}>
          <section
            className="record-modal"
            role="dialog"
            aria-modal="true"
            aria-label={t.records.record}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-heading">
              <div>
                <span>{t.records.record}</span>
                <h2>{detail?.client_name || t.common.loading}</h2>
              </div>
              <button type="button" title={t.common.close} onClick={closeDetail}>
                <X size={18} />
              </button>
            </div>

            {detailLoading && <div className="modal-loading">{t.common.loading}</div>}

            {detail && (
              <div className="detail-sections">
                {visibleDetailSections.map((section) => (
                  <section className="detail-section" key={section.title}>
                    <h3>{section.title}</h3>
                    <div className="detail-grid">
                      {section.fields.map((item) => (
                        <div className="detail-item" key={item.field}>
                          <span>{item.label}</span>
                          <strong>{item.value}</strong>
                        </div>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </section>
  );
}
