import re

from records.models import UploadBatch

from .constants import HEADER_ALIASES
from .normalizers import normalize_header, normalize_text, parse_datetime


def find_header_row(worksheet):
    for index, row in enumerate(worksheet.iter_rows(values_only=True), start=1):
        normalized = [normalize_header(value) for value in row]
        if "наименование клиента" in normalized:
            headers = {}
            for col_index, header in enumerate(normalized):
                field_name = field_for_header(header)
                if field_name:
                    headers[col_index] = field_name
            return index, headers
    return None, {}


def field_for_header(header):
    if not header:
        return None
    for field_name, aliases in HEADER_ALIASES.items():
        if header in aliases:
            return field_name
    return None


def detect_source_type(headers, worksheet):
    fields = set(headers.values())
    if {"phone_number", "sim_card_number"} & fields:
        return UploadBatch.SourceType.MOBILE
    if {"internet_login", "account_number", "technology"} & fields:
        return UploadBatch.SourceType.INTERNET

    title = normalize_text(worksheet.cell(row=1, column=1).value).lower()
    if "шпд" in title:
        return UploadBatch.SourceType.INTERNET
    if "gsm" in title:
        return UploadBatch.SourceType.MOBILE
    return UploadBatch.SourceType.UNKNOWN


def parse_period(worksheet):
    text = normalize_text(worksheet.cell(row=2, column=1).value)
    matches = re.findall(r"\d{2}\.\d{2}\.\d{4}(?:\s+\d{2}:\d{2}:\d{2})?", text)
    if len(matches) < 2:
        return None, None
    return parse_datetime(matches[0]), parse_datetime(matches[1])


def map_row(headers, values):
    row = {}
    for col_index, field_name in headers.items():
        if col_index < len(values):
            row[field_name] = values[col_index]
    return row


def is_empty_row(row):
    return not any(normalize_text(value) for value in row.values())
