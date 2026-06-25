from django.contrib import admin

from .models import Announcement, RegistryRecord, UploadBatch


@admin.register(UploadBatch)
class UploadBatchAdmin(admin.ModelAdmin):
    list_display = (
        "original_filename",
        "uploaded_by",
        "assigned_region",
        "assigned_branch",
        "source_type",
        "imported_count",
        "duplicate_count",
        "skipped_count",
        "created_at",
    )
    list_filter = ("source_type", "assigned_region", "assigned_branch", "created_at")
    search_fields = ("original_filename", "uploaded_by__username")


@admin.register(RegistryRecord)
class RegistryRecordAdmin(admin.ModelAdmin):
    list_display = (
        "client_name",
        "source_type",
        "phone_number",
        "internet_login",
        "uploaded_by",
        "assigned_region",
        "assigned_branch",
        "created_at",
    )
    list_filter = ("source_type", "assigned_region", "assigned_branch", "status", "created_at")
    search_fields = (
        "client_name",
        "phone_number",
        "internet_login",
        "request_number",
    )


@admin.register(Announcement)
class AnnouncementAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "target",
        "created_by",
        "assigned_region",
        "assigned_branch",
        "is_active",
        "created_at",
    )
    list_filter = ("target", "is_active", "assigned_region", "assigned_branch", "created_at")
    search_fields = ("title", "body", "created_by__username")
