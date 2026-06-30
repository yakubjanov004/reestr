from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import AuditLog, Branch, LoginSmsChallenge, LoginTrustedDevice, Region, User


@admin.register(Region)
class RegionAdmin(admin.ModelAdmin):
    list_display = ("name", "created_at")
    search_fields = ("name",)


@admin.register(Branch)
class BranchAdmin(admin.ModelAdmin):
    list_display = ("name", "region", "code", "is_active")
    list_filter = ("region", "is_active")
    search_fields = ("name", "code", "region__name")


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        ("Datan", {"fields": ("phone_number", "role", "region", "branch", "created_by")}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ("Datan", {"fields": ("phone_number", "role", "region", "branch", "created_by")}),
    )
    list_display = ("username", "phone_number", "email", "first_name", "last_name", "role", "region", "branch", "is_active")
    list_filter = ("role", "region", "branch", "is_active", "is_staff")


@admin.register(LoginSmsChallenge)
class LoginSmsChallengeAdmin(admin.ModelAdmin):
    list_display = ("user", "phone_number", "delivery_channel", "attempts", "created_at", "expires_at", "verified_at")
    list_filter = ("delivery_channel", "created_at", "verified_at")
    search_fields = ("user__username", "phone_number")
    readonly_fields = ("user", "phone_number", "challenge_token", "code_hash", "delivery_channel", "attempts", "max_attempts", "created_at", "expires_at", "verified_at")


@admin.register(LoginTrustedDevice)
class LoginTrustedDeviceAdmin(admin.ModelAdmin):
    list_display = ("user", "is_active", "last_ip", "created_at", "last_used_at", "expires_at")
    list_filter = ("is_active", "created_at", "expires_at")
    search_fields = ("user__username", "last_ip")
    readonly_fields = ("user", "token_hash", "user_agent", "last_ip", "created_at", "last_used_at", "expires_at")


@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ("action", "actor", "target_type", "target_label", "created_at")
    list_filter = ("action", "created_at")
    search_fields = ("actor__username", "target_label", "action")
    readonly_fields = ("actor", "action", "target_type", "target_id", "target_label", "metadata", "created_at")
