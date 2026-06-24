import { formatDateTime } from "../../utils/format.js";

export const COLUMN_COUNT = 18;

export const EMPTY_FILTERS = {
  date_from: "",
  date_to: "",
  uploaded_by: "",
  region: "",
  dealer: "",
  status: ""
};

export function sourceLabel(sourceType, t) {
  return sourceType === "mobile" ? t.source.mobileShort : t.source.internetShort;
}

export function amount(value) {
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

function recordDetailSections(t) {
  return [
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
}

export function getVisibleDetailSections(detail, t) {
  if (!detail) {
    return [];
  }

  return recordDetailSections(t)
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
    .filter((section) => section.fields.length > 0);
}
