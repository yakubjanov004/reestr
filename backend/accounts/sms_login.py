import re
import secrets

from django.conf import settings
from django.utils import timezone
from django.utils.crypto import constant_time_compare, salted_hmac


def normalize_phone_number(value):
    raw = (value or "").strip()
    if not raw:
        return ""

    digits = re.sub(r"\D+", "", raw)
    if not digits:
        return ""
    if len(digits) == 9:
        digits = f"998{digits}"
    elif digits.startswith("0") and len(digits) == 10:
        digits = f"998{digits[1:]}"
    elif digits.startswith("8") and len(digits) == 11:
        digits = f"998{digits[1:]}"
    return f"+{digits}"


def mask_phone_number(phone_number):
    digits = re.sub(r"\D+", "", phone_number or "")
    if len(digits) < 7:
        return phone_number or ""
    return f"+{digits[:3]} ** *** {digits[-4:]}"


def make_sms_code():
    return f"{secrets.randbelow(1_000_000):06d}"


def hash_sms_code(code):
    return salted_hmac("accounts.login_sms_code", str(code)).hexdigest()


def check_sms_code(code, code_hash):
    return constant_time_compare(hash_sms_code(code), code_hash)


def make_trusted_device_token():
    return secrets.token_urlsafe(32)


def hash_trusted_device_token(token):
    return salted_hmac("accounts.login_trusted_device", str(token)).hexdigest()


def seconds_until(value):
    return max(0, int((value - timezone.now()).total_seconds()))


def request_ip(request):
    forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR", "")
    if forwarded_for:
        return forwarded_for.split(",", 1)[0].strip()[:64]
    return request.META.get("REMOTE_ADDR", "")[:64]


def request_user_agent(request):
    return request.META.get("HTTP_USER_AGENT", "")[:255]


def send_login_sms(phone_number, code):
    if settings.SMS_LOGIN_MOCK:
        return {"provider": "mock", "mock_code": code}
    return {"provider": "sms"}
