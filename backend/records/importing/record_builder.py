import hashlib
import hmac

from django.conf import settings

from records.models import UploadBatch

from .constants import DATE_FIELDS, DATETIME_FIELDS, DECIMAL_FIELDS, HEADER_ALIASES
from .normalizers import normalize_text, parse_date, parse_datetime, parse_decimal, serialize_cell


def build_record_kwargs(row, source_type, batch, uploaded_by, dedupe_row=None):
    assigned_region = uploaded_by.branch.region if uploaded_by.branch_id else uploaded_by.region
    raw_data = {key: serialize_cell(value) for key, value in row.items()}
    kwargs = {
        "source_type": source_type,
        "upload_batch": batch,
        "uploaded_by": uploaded_by,
        "assigned_region": assigned_region,
        "assigned_branch": uploaded_by.branch,
        "raw_data": raw_data,
    }

    for field_name in HEADER_ALIASES:
        if field_name in DATETIME_FIELDS:
            kwargs[field_name] = parse_datetime(row.get(field_name))
        elif field_name in DATE_FIELDS:
            kwargs[field_name] = parse_date(row.get(field_name))
        elif field_name in DECIMAL_FIELDS:
            kwargs[field_name] = parse_decimal(row.get(field_name))
        else:
            kwargs[field_name] = normalize_text(row.get(field_name))

    kwargs["dedupe_key"] = build_dedupe_key(source_type, dedupe_row or kwargs)
    return kwargs


def build_dedupe_key(source_type, data):
    identity_parts = []
    if data.get("contract_number"):
        identity_parts = ["contract", data["contract_number"]]
    elif data.get("request_number"):
        identity_parts = ["request", data["request_number"]]
    elif source_type == UploadBatch.SourceType.MOBILE and (
        data.get("phone_number") or data.get("sim_card_number")
    ):
        identity_parts = ["mobile", data.get("phone_number"), data.get("sim_card_number")]
    elif source_type == UploadBatch.SourceType.INTERNET and (
        data.get("internet_login") or data.get("account_number")
    ):
        identity_parts = ["internet", data.get("internet_login"), data.get("account_number")]
    else:
        identity_parts = [
            "fallback",
            source_type,
            data.get("document_number"),
            data.get("client_name"),
            serialize_cell(data.get("connection_date") or data.get("contract_date")),
        ]

    normalized = "|".join(normalize_text(part).lower() for part in identity_parts if part)
    secret = settings.SECRET_KEY.encode("utf-8")
    return hmac.new(secret, normalized.encode("utf-8"), hashlib.sha256).hexdigest()
