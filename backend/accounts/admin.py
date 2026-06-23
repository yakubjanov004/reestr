from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import AuditLog, User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        ("Reestr Telecom", {"fields": ("role", "created_by")}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ("Reestr Telecom", {"fields": ("role", "created_by")}),
    )
    list_display = ("username", "email", "first_name", "last_name", "role", "is_active")
    list_filter = ("role", "is_active", "is_staff")


@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ("action", "actor", "target_type", "target_label", "created_at")
    list_filter = ("action", "created_at")
    search_fields = ("actor__username", "target_label", "action")
    readonly_fields = ("actor", "action", "target_type", "target_id", "target_label", "metadata", "created_at")
