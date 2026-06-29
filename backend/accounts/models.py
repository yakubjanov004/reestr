from django.contrib.auth.models import AbstractUser, UserManager as DjangoUserManager
from django.db import models


class UserManager(DjangoUserManager):
    def create_superuser(self, username, email=None, password=None, **extra_fields):
        extra_fields.setdefault("role", User.Role.ADMIN)
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return super().create_superuser(username, email, password, **extra_fields)


class Region(models.Model):
    name = models.CharField(max_length=120, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ("name",)

    def __str__(self):
        return self.name


class Branch(models.Model):
    region = models.ForeignKey(
        Region,
        on_delete=models.PROTECT,
        related_name="branches",
    )
    name = models.CharField(max_length=160)
    code = models.CharField(max_length=50, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ("region__name", "name")
        constraints = [
            models.UniqueConstraint(fields=["region", "name"], name="accounts_branch_region_name_uniq"),
        ]

    def __str__(self):
        return f"{self.region} / {self.name}"


class User(AbstractUser):
    class Role(models.TextChoices):
        OPERATOR = "operator", "Operator"
        SUPERVISOR = "supervisor", "Supervisor"
        MANAGER = "manager", "Manager"
        ADMIN = "admin", "Admin"

    role = models.CharField(max_length=20, choices=Role.choices, default=Role.OPERATOR)
    region = models.ForeignKey(
        Region,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="users",
    )
    branch = models.ForeignKey(
        Branch,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="users",
    )
    created_by = models.ForeignKey(
        "self",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="created_operators",
    )

    objects = UserManager()

    ROLE_RANKS = {
        Role.OPERATOR: 10,
        Role.SUPERVISOR: 20,
        Role.MANAGER: 30,
        Role.ADMIN: 40,
    }

    @property
    def role_rank(self):
        if self.is_superuser:
            return self.ROLE_RANKS[self.Role.ADMIN]
        return self.ROLE_RANKS.get(self.role, 0)

    @property
    def is_manager(self):
        return self.role_rank >= self.ROLE_RANKS[self.Role.MANAGER]

    @property
    def is_supervisor(self):
        return self.role == self.Role.SUPERVISOR

    @property
    def is_operator(self):
        return self.role == self.Role.OPERATOR

    @property
    def is_admin_role(self):
        return self.role_rank >= self.ROLE_RANKS[self.Role.ADMIN]

    @property
    def can_manage_users(self):
        return self.role_rank >= self.ROLE_RANKS[self.Role.SUPERVISOR]

    @property
    def can_view_all_data(self):
        return self.role_rank >= self.ROLE_RANKS[self.Role.MANAGER]

    @property
    def effective_region(self):
        if self.branch_id:
            return self.branch.region
        return self.region

    @property
    def effective_region_id(self):
        if self.branch_id:
            return self.branch.region_id
        return self.region_id


class AuditLog(models.Model):
    actor = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="audit_logs",
    )
    action = models.CharField(max_length=100)
    target_type = models.CharField(max_length=100, blank=True)
    target_id = models.CharField(max_length=100, blank=True)
    target_label = models.CharField(max_length=255, blank=True)
    metadata = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ("-created_at", "-id")
        indexes = [
            models.Index(fields=["action", "created_at"], name="accounts_au_action_b2247e_idx"),
            models.Index(fields=["actor", "created_at"], name="accounts_au_actor_i_5e6019_idx"),
        ]

    def __str__(self):
        return f"{self.action} ({self.created_at:%Y-%m-%d %H:%M})"
