import re

from .constants import MASKED_FIELDS, PART_MASK_FIELDS, RED_FIELDS, SUFFIX_DIGIT_MASK_FIELDS
from .normalizers import normalize_text


def apply_privacy_rules(row, source_type):
    red_fields = RED_FIELDS.get(source_type, set())
    masked_fields = MASKED_FIELDS.get(source_type, set())
    cleaned = {}
    for field_name, value in row.items():
        if field_name in red_fields:
            continue
        if field_name in masked_fields:
            cleaned[field_name] = mask_field_value(field_name, value)
        else:
            cleaned[field_name] = value
    return cleaned


def mask_field_value(field_name, value):
    if field_name in PART_MASK_FIELDS:
        return mask_parts(value)
    if field_name in SUFFIX_DIGIT_MASK_FIELDS:
        return mask_digit_suffix(value)
    return mask_value(value)


def mask_parts(value):
    text = normalize_text(value)
    if not text:
        return ""
    return " ".join(mask_value(part) for part in text.split())


def mask_value(value):
    text = normalize_text(value)
    if not text:
        return ""
    return f"{text[:3]}***"


def mask_digit_suffix(value):
    text = normalize_text(value)
    if not text:
        return ""

    digit_positions = [match.start() for match in re.finditer(r"\d", text)]
    if len(digit_positions) < 3:
        return mask_value(text)

    suffix_start = digit_positions[-3]
    suffix_digits = "".join(text[position] for position in digit_positions[-3:])
    return f"{'*' * suffix_start}{suffix_digits}"


def remask_existing_value(field_name, value):
    text = normalize_text(value)
    if not text:
        return ""
    if field_name in PART_MASK_FIELDS:
        return " ".join(remask_existing_part(part) for part in text.split())
    if field_name in SUFFIX_DIGIT_MASK_FIELDS:
        if text.startswith("***"):
            return text
        if text.endswith("***"):
            return text
        return mask_digit_suffix(text)
    return remask_existing_part(text)


def remask_existing_part(text):
    if text.endswith("***"):
        return text
    return mask_value(text)


def sanitize_record_instance(record):
    red_fields = RED_FIELDS.get(record.source_type, set())
    masked_fields = MASKED_FIELDS.get(record.source_type, set())

    for field_name in red_fields:
        if hasattr(record, field_name):
            field = record._meta.get_field(field_name)
            setattr(record, field_name, None if field.null else "")

    for field_name in masked_fields:
        if hasattr(record, field_name):
            current = getattr(record, field_name)
            if current:
                setattr(record, field_name, remask_existing_value(field_name, current))

    raw_data = {}
    for field_name, value in (record.raw_data or {}).items():
        if field_name in red_fields:
            continue
        raw_data[field_name] = remask_existing_value(field_name, value) if field_name in masked_fields else value
    record.raw_data = raw_data
    return record
