import re
from datetime import date, datetime, time
from decimal import Decimal, InvalidOperation

from django.utils import timezone


def normalize_header(value):
    if value is None:
        return ""
    text = str(value).replace("\n", " ").strip().lower()
    return re.sub(r"\s+", " ", text)


def normalize_text(value):
    if value is None:
        return ""
    if isinstance(value, datetime):
        return value.strftime("%d.%m.%Y %H:%M:%S")
    if isinstance(value, date):
        return value.strftime("%d.%m.%Y")
    text = str(value).strip()
    return re.sub(r"\s+", " ", text)


def serialize_cell(value):
    if isinstance(value, datetime):
        return value.isoformat()
    if isinstance(value, date):
        return value.isoformat()
    if isinstance(value, Decimal):
        return str(value)
    return normalize_text(value)


def parse_date(value):
    parsed = parse_datetime(value)
    if parsed:
        return parsed.date()
    return None


def parse_datetime(value):
    if isinstance(value, datetime):
        return ensure_aware(value)
    if isinstance(value, date):
        return ensure_aware(datetime.combine(value, time.min))
    text = normalize_text(value)
    if not text:
        return None

    formats = (
        "%d.%m.%Y %H:%M:%S",
        "%d.%m.%Y %H:%M",
        "%d.%m.%Y",
        "%Y-%m-%d %H:%M:%S",
        "%Y-%m-%d",
    )
    for fmt in formats:
        try:
            parsed = datetime.strptime(text, fmt)
            return ensure_aware(parsed)
        except ValueError:
            continue
    return None


def ensure_aware(value):
    if timezone.is_aware(value):
        return value
    return timezone.make_aware(value, timezone.get_current_timezone())


def parse_decimal(value):
    text = normalize_text(value).replace(" ", "").replace(",", ".")
    if not text:
        return None
    try:
        return Decimal(text)
    except (InvalidOperation, ValueError):
        return None
