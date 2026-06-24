from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import AuditLog, Branch, Region, User


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
        ("Datan", {"fields": ("role", "region", "branch", "created_by")}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ("Datan", {"fields": ("role", "region", "branch", "created_by")}),
    )
    list_display = ("username", "email", "first_name", "last_name", "role", "region", "branch", "is_active")
    list_filter = ("role", "region", "branch", "is_active", "is_staff")


@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ("action", "actor", "target_type", "target_label", "created_at")
    list_filter = ("action", "created_at")
    search_fields = ("actor__username", "target_label", "action")
    readonly_fields = ("actor", "action", "target_type", "target_id", "target_label", "metadata", "created_at")
