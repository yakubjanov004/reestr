from datetime import timedelta

from django.contrib.auth.password_validation import validate_password
from django.conf import settings
from django.utils import timezone
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken

from .audit import log_audit_event
from .models import AuditLog, Branch, LoginSmsChallenge, LoginTrustedDevice, Region, User
from .sms_login import (
    check_sms_code,
    hash_sms_code,
    hash_trusted_device_token,
    make_sms_code,
    make_trusted_device_token,
    mask_phone_number,
    normalize_phone_number,
    request_ip,
    request_user_agent,
    seconds_until,
    send_login_sms,
)


class RegionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Region
        fields = ("id", "name")
        read_only_fields = fields


class BranchSerializer(serializers.ModelSerializer):
    region_name = serializers.CharField(source="region.name", read_only=True)

    class Meta:
        model = Branch
        fields = ("id", "name", "code", "is_active", "region", "region_name")
        read_only_fields = fields


def normalize_location_name(value):
    return " ".join((value or "").strip().split())


def role_label(role):
    return dict(User.Role.choices).get(role, role)


def build_token_payload(user):
    refresh = RefreshToken.for_user(user)
    refresh["role"] = user.role
    refresh["username"] = user.username
    return {
        "refresh": str(refresh),
        "access": str(refresh.access_token),
        "user": UserSerializer(user).data,
    }


class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    region = RegionSerializer(read_only=True)
    branch = BranchSerializer(read_only=True)

    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "phone_number",
            "email",
            "first_name",
            "last_name",
            "full_name",
            "role",
            "region",
            "branch",
            "is_active",
            "is_staff",
            "is_superuser",
            "date_joined",
        )
        read_only_fields = fields

    def get_full_name(self, obj):
        return obj.get_full_name() or obj.username


class SelfProfileSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    region = RegionSerializer(read_only=True)
    branch = BranchSerializer(read_only=True)

    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "phone_number",
            "email",
            "first_name",
            "last_name",
            "full_name",
            "role",
            "region",
            "branch",
            "is_active",
            "is_staff",
            "is_superuser",
            "date_joined",
        )
        read_only_fields = (
            "id",
            "username",
            "phone_number",
            "full_name",
            "role",
            "region",
            "branch",
            "is_active",
            "is_staff",
            "is_superuser",
            "date_joined",
        )

    def get_full_name(self, obj):
        return obj.get_full_name() or obj.username


class PasswordChangeSerializer(serializers.Serializer):
    current_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True)

    def validate_current_password(self, value):
        user = self.context["request"].user
        if not user.check_password(value):
            raise serializers.ValidationError("Joriy parol noto'g'ri.")
        return value

    def validate(self, attrs):
        if attrs["new_password"] != attrs["confirm_password"]:
            raise serializers.ValidationError({"confirm_password": "Yangi parollar bir xil emas."})
        validate_password(attrs["new_password"], self.context["request"].user)
        return attrs

    def save(self, **kwargs):
        user = self.context["request"].user
        user.set_password(self.validated_data["new_password"])
        user.save(update_fields=["password"])
        LoginTrustedDevice.objects.filter(user=user).update(is_active=False)
        return user


class AuditLogSerializer(serializers.ModelSerializer):
    actor_username = serializers.SerializerMethodField()
    actor_full_name = serializers.SerializerMethodField()
    actor_role = serializers.SerializerMethodField()

    class Meta:
        model = AuditLog
        fields = (
            "id",
            "actor",
            "actor_username",
            "actor_full_name",
            "actor_role",
            "action",
            "target_type",
            "target_id",
            "target_label",
            "metadata",
            "created_at",
        )
        read_only_fields = fields

    def get_actor_username(self, obj):
        return obj.actor.username if obj.actor else ""

    def get_actor_full_name(self, obj):
        return obj.actor.get_full_name() if obj.actor else ""

    def get_actor_role(self, obj):
        return obj.actor.role if obj.actor else ""


class OperatorCreateUpdateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False, min_length=8)
    role = serializers.ChoiceField(choices=User.Role.choices, required=False)
    phone_number = serializers.CharField(required=False, allow_blank=True)
    region_id = serializers.PrimaryKeyRelatedField(
        queryset=Region.objects.all(),
        source="region",
        required=False,
        allow_null=True,
        write_only=True,
    )
    branch_id = serializers.PrimaryKeyRelatedField(
        queryset=Branch.objects.select_related("region").all(),
        source="branch",
        required=False,
        allow_null=True,
        write_only=True,
    )
    region_name = serializers.CharField(required=False, allow_blank=True, write_only=True)
    branch_name = serializers.CharField(required=False, allow_blank=True, write_only=True)

    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "phone_number",
            "password",
            "email",
            "first_name",
            "last_name",
            "role",
            "region_id",
            "branch_id",
            "region_name",
            "branch_name",
            "is_active",
        )
        read_only_fields = ("id",)

    def validate_password(self, value):
        validate_password(value)
        return value

    def validate_phone_number(self, value):
        phone_number = normalize_phone_number(value)
        if not phone_number:
            return None
        queryset = User.objects.filter(phone_number=phone_number)
        if self.instance is not None:
            queryset = queryset.exclude(pk=self.instance.pk)
        if queryset.exists():
            raise serializers.ValidationError("Bu telefon raqami boshqa foydalanuvchiga biriktirilgan.")
        return phone_number

    def validate(self, attrs):
        request = self.context["request"]
        actor = request.user
        if self.instance is None and not attrs.get("password"):
            raise serializers.ValidationError({"password": "Parol majburiy."})
        if self.instance is None and not attrs.get("phone_number"):
            raise serializers.ValidationError({"phone_number": "Telefon raqami majburiy."})

        role_was_submitted = "role" in attrs
        location_was_submitted = any(
            key in attrs for key in ("region", "branch", "region_name", "branch_name")
        )
        role = attrs.get("role") or (self.instance.role if self.instance else User.Role.OPERATOR)
        self._validate_actor_can_assign_role(actor, role)

        region = attrs.pop("region", None)
        branch = attrs.pop("branch", None)
        region_name = normalize_location_name(attrs.pop("region_name", ""))
        branch_name = normalize_location_name(attrs.pop("branch_name", ""))

        if self.instance is not None:
            region = region if region is not None else self.instance.region
            branch = branch if branch is not None else self.instance.branch

        if actor.is_supervisor:
            actor_region = actor.effective_region
            if not actor_region:
                raise serializers.ValidationError({"region": "Supervisor viloyatga biriktirilmagan."})
            region = actor_region

        if region_name:
            raise serializers.ValidationError({"region_name": "Viloyat oldindan kiritiladi. Ro'yxatdan tanlang."})

        if branch_name:
            raise serializers.ValidationError({"branch_name": "Filial oldindan kiritiladi. Ro'yxatdan tanlang."})

        if branch:
            if region and branch.region_id != region.id:
                raise serializers.ValidationError({"branch": "Filial tanlangan viloyatga tegishli emas."})
            region = branch.region

        if actor.is_supervisor and branch and branch.region_id != actor.effective_region_id:
            raise serializers.ValidationError({"branch": "Supervisor faqat o'z viloyatidagi filialni tanlay oladi."})

        if role == User.Role.OPERATOR:
            if not branch and (self.instance is None or role_was_submitted or location_was_submitted):
                raise serializers.ValidationError({"branch": "Operator uchun filial majburiy."})
            if branch:
                region = branch.region
        elif role == User.Role.SUPERVISOR:
            if not region and (self.instance is None or role_was_submitted or location_was_submitted):
                raise serializers.ValidationError({"region": "Supervisor uchun viloyat majburiy."})
            branch = None
        elif role == User.Role.MANAGER:
            if branch:
                region = branch.region
        elif role == User.Role.ADMIN:
            raise serializers.ValidationError({"role": "Admin foydalanuvchi formadan yaratilmaydi."})

        attrs["region"] = region
        attrs["branch"] = branch
        return attrs

    def _validate_actor_can_assign_role(self, actor, role):
        if actor.is_admin_role and role == User.Role.MANAGER:
            return
        if actor.role == User.Role.MANAGER and role in {User.Role.OPERATOR, User.Role.SUPERVISOR}:
            return
        if actor.role == User.Role.SUPERVISOR and role == User.Role.OPERATOR:
            return
        raise serializers.ValidationError({"role": f"{role_label(role)} rolini berishga ruxsat yo'q."})

    def create(self, validated_data):
        password = validated_data.pop("password")
        request = self.context["request"]
        user = User(
            **validated_data,
            created_by=request.user,
        )
        user.set_password(password)
        user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop("password", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
            LoginTrustedDevice.objects.filter(user=instance).update(is_active=False)
        instance.save()
        return instance


def trusted_device_for_token(user, token):
    if not token:
        return None
    token_hash = hash_trusted_device_token(token)
    device = LoginTrustedDevice.objects.filter(user=user, token_hash=token_hash, is_active=True).first()
    if not device or not device.is_valid:
        return None
    return device


def create_trusted_device(user, request):
    raw_token = make_trusted_device_token()
    now = timezone.now()
    device = LoginTrustedDevice.objects.create(
        user=user,
        token_hash=hash_trusted_device_token(raw_token),
        user_agent=request_user_agent(request),
        last_ip=request_ip(request),
        expires_at=now + timedelta(hours=settings.SMS_LOGIN_TRUST_HOURS),
    )
    return raw_token, device


def login_metadata(request, method):
    return {
        "method": method,
        "ip": request_ip(request),
        "user_agent": request_user_agent(request)[:200],
    }


class SmsLoginStartSerializer(serializers.Serializer):
    phone_number = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True, trim_whitespace=False)
    trusted_device_token = serializers.CharField(write_only=True, required=False, allow_blank=True)

    default_error_messages = {
        "invalid_credentials": "Telefon raqami yoki parol noto'g'ri.",
    }

    def validate(self, attrs):
        phone_number = normalize_phone_number(attrs.get("phone_number"))
        password = attrs.get("password") or ""
        user = (
            User.objects.select_related("region", "branch", "branch__region")
            .filter(phone_number=phone_number, is_active=True)
            .first()
            if phone_number
            else None
        )
        if not user or not user.check_password(password):
            raise serializers.ValidationError({"detail": self.error_messages["invalid_credentials"]})
        attrs["phone_number"] = phone_number
        attrs["user"] = user
        return attrs

    def save(self, **kwargs):
        request = self.context["request"]
        user = self.validated_data["user"]
        trusted_device = trusted_device_for_token(user, self.validated_data.get("trusted_device_token"))

        if trusted_device:
            now = timezone.now()
            trusted_device.last_used_at = now
            trusted_device.last_ip = request_ip(request)
            trusted_device.user_agent = request_user_agent(request)
            trusted_device.save(update_fields=["last_used_at", "last_ip", "user_agent"])
            log_audit_event(
                actor=user,
                action="login",
                target=user,
                metadata=login_metadata(request, "trusted_device"),
            )
            payload = build_token_payload(user)
            payload.update(
                {
                    "requires_sms": False,
                    "trusted_device_expires_at": trusted_device.expires_at,
                }
            )
            return payload

        code = make_sms_code()
        expires_at = timezone.now() + timedelta(minutes=settings.SMS_LOGIN_CODE_TTL_MINUTES)
        delivery = send_login_sms(user.phone_number, code)
        challenge = LoginSmsChallenge.objects.create(
            user=user,
            phone_number=user.phone_number,
            challenge_token=make_trusted_device_token(),
            code_hash=hash_sms_code(code),
            delivery_channel=delivery["provider"],
            expires_at=expires_at,
        )
        log_audit_event(
            actor=user,
            action="login_sms_requested",
            target=user,
            metadata={"method": delivery["provider"], "expires_in_seconds": seconds_until(expires_at)},
        )
        payload = {
            "requires_sms": True,
            "challenge_token": challenge.challenge_token,
            "phone_number": mask_phone_number(user.phone_number),
            "expires_in_seconds": seconds_until(expires_at),
        }
        if delivery.get("mock_code"):
            payload["mock_code"] = delivery["mock_code"]
        return payload


class SmsLoginVerifySerializer(serializers.Serializer):
    challenge_token = serializers.CharField(write_only=True)
    code = serializers.RegexField(regex=r"^\d{6}$", write_only=True, error_messages={"invalid": "SMS kod 6 ta raqamdan iborat bo'lishi kerak."})

    def validate(self, attrs):
        challenge = (
            LoginSmsChallenge.objects.select_related("user", "user__region", "user__branch", "user__branch__region")
            .filter(challenge_token=attrs.get("challenge_token"))
            .first()
        )
        if not challenge:
            raise serializers.ValidationError({"detail": "SMS tasdiqlash sessiyasi topilmadi."})
        if challenge.verified_at is not None:
            raise serializers.ValidationError({"detail": "Bu SMS kod allaqachon ishlatilgan."})
        if challenge.is_expired:
            raise serializers.ValidationError({"detail": "SMS kod muddati tugagan. Qayta kod oling."})
        if challenge.attempts >= challenge.max_attempts:
            raise serializers.ValidationError({"detail": "Urinishlar soni tugagan. Qayta kod oling."})
        if not challenge.user.is_active:
            raise serializers.ValidationError({"detail": "Foydalanuvchi bloklangan."})
        if not check_sms_code(attrs["code"], challenge.code_hash):
            challenge.attempts += 1
            challenge.save(update_fields=["attempts"])
            raise serializers.ValidationError({"detail": "SMS kod noto'g'ri."})
        attrs["challenge"] = challenge
        attrs["user"] = challenge.user
        return attrs

    def save(self, **kwargs):
        request = self.context["request"]
        challenge = self.validated_data["challenge"]
        user = self.validated_data["user"]
        now = timezone.now()
        challenge.verified_at = now
        challenge.save(update_fields=["verified_at"])

        trusted_token, trusted_device = create_trusted_device(user, request)
        log_audit_event(
            actor=user,
            action="login",
            target=user,
            metadata=login_metadata(request, "sms_code"),
        )
        payload = build_token_payload(user)
        payload.update(
            {
                "requires_sms": False,
                "trusted_device_token": trusted_token,
                "trusted_device_expires_at": trusted_device.expires_at,
            }
        )
        return payload

