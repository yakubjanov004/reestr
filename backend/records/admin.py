from django.contrib import admin

from .models import RegistryRecord, UploadBatch


@admin.register(UploadBatch)
class UploadBatchAdmin(admin.ModelAdmin):
    list_display = (
        "original_filename",
        "uploaded_by",
        "source_type",
        "imported_count",
        "duplicate_count",
        "skipped_count",
        "created_at",
    )
    list_filter = ("source_type", "created_at")
    search_fields = ("original_filename", "uploaded_by__username")


@admin.register(RegistryRecord)
class RegistryRecordAdmin(admin.ModelAdmin):
    list_display = (
        "client_name",
        "source_type",
        "phone_number",
        "internet_login",
        "uploaded_by",
        "created_at",
    )
    list_filter = ("source_type", "status", "created_at")
    search_fields = (
        "client_name",
        "phone_number",
        "internet_login",
        "request_number",
    )
