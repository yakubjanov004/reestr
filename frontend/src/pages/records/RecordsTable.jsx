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
              <td colSpan={COLUMN_COUNT}>{t.common.loading}</td>
            </tr>
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
              <td colSpan={COLUMN_COUNT}>{t.records.notFound}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
