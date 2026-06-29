from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .audit import log_audit_event
from .models import AuditLog, Branch, Region, User


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


class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    region = RegionSerializer(read_only=True)
    branch = BranchSerializer(read_only=True)

    class Meta:
        model = User
        fields = (
            "id",
            "username",
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

    def validate(self, attrs):
        request = self.context["request"]
        actor = request.user
        if self.instance is None and not attrs.get("password"):
            raise serializers.ValidationError({"password": "Password is required."})

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
        instance.save()
        return instance


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["role"] = user.role
        token["username"] = user.username
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data["user"] = UserSerializer(self.user).data
        request = self.context.get("request")
        log_audit_event(
            actor=self.user,
            action="login",
            target=self.user,
            metadata={
                "ip": request.META.get("REMOTE_ADDR", "") if request else "",
                "user_agent": request.META.get("HTTP_USER_AGENT", "")[:200] if request else "",
            },
        )
        return data
