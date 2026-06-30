import { formatDateTime } from "../../utils/format.js";
import { amount, COLUMN_COUNT, sourceLabel } from "./recordUtils.js";

export default function RecordsTable({ t, records, loading, onOpenDetail }) {
  return (
    <div className="table-wrap">
      <table className="records-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>{t.records.client}</th>
            <th>{t.common.type}</th>
            <th>{t.common.region}</th>
            <th>{t.common.branch}</th>
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
            <>
              {Array.from({ length: 15 }).map((_, idx) => (
                <tr key={`skeleton-${idx}`}>
                  <td colSpan={COLUMN_COUNT}>
                    <div className="skeleton skeleton-row" style={{ margin: 0, height: '36px' }} />
                  </td>
                </tr>
              ))}
            </>
          )}
          {!loading &&
            records.map((record) => (
              <tr
                className="clickable-row"
                key={record.id}
                tabIndex={0}
                onClick={() => onOpenDetail(record.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    onOpenDetail(record.id);
                  }
                }}
              >
                <td data-label="ID">{record.id}</td>
                <td data-label={t.records.client}>{record.client_name}</td>
                <td data-label={t.common.type}>
                  <span className={`source-pill ${record.source_type}`}>
                    {sourceLabel(record.source_type, t)}
                  </span>
                </td>
                <td data-label={t.common.region}>{record.assigned_region_name || "-"}</td>
                <td data-label={t.common.branch}>{record.assigned_branch_name || "-"}</td>
                <td data-label={t.records.region}>{record.region}</td>
                <td data-label={t.records.dealer}>{record.dealer}</td>
                <td data-label={t.records.phoneLogin}>{record.phone_number || record.internet_login}</td>
                <td data-label={t.records.tariff}>{record.tariff_plan}</td>
                <td data-label={t.common.status}>{record.status}</td>
                <td data-label={t.records.identification}>{record.identification_method}</td>
                <td data-label={t.records.excelOperator}>{record.operator_full_name}</td>
                <td data-label={t.records.payment}>{amount(record.payment_amount)}</td>
                <td data-label={t.records.connectionDate}>{formatDateTime(record.connection_date || record.contract_date)}</td>
                <td data-label={t.records.modem}>{record.modem_model}</td>
                <td data-label={t.records.modemCost}>{amount(record.modem_cost)}</td>
                <td data-label={t.records.transfer}>{record.transfer_type}</td>
                <td data-label={t.records.request}>{record.request_number}</td>
                <td data-label={t.records.uploadedBy}>{record.uploaded_by_username}</td>
                <td data-label={t.records.import}>{formatDateTime(record.created_at)}</td>
              </tr>
            ))}
          {!loading && records.length === 0 && (
            <tr>
              <td colSpan={COLUMN_COUNT}>{t.records.notFound}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
