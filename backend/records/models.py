from django.conf import settings
from django.db import models


class UploadBatch(models.Model):
    class SourceType(models.TextChoices):
        MOBILE = "mobile", "GSM"
        INTERNET = "internet", "SHPD"
        UNKNOWN = "unknown", "Unknown"

    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="upload_batches",
    )
    file = models.FileField(upload_to="uploads/%Y/%m/%d/")
    original_filename = models.CharField(max_length=255)
    source_type = models.CharField(
        max_length=20,
        choices=SourceType.choices,
        default=SourceType.UNKNOWN,
    )
    period_start = models.DateTimeField(null=True, blank=True)
    period_end = models.DateTimeField(null=True, blank=True)
    rows_in_file = models.PositiveIntegerField(default=0)
    imported_count = models.PositiveIntegerField(default=0)
    duplicate_count = models.PositiveIntegerField(default=0)
    skipped_count = models.PositiveIntegerField(default=0)
    import_errors = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ("-created_at",)

    def __str__(self):
        return f"{self.original_filename} ({self.created_at:%Y-%m-%d})"


class RegistryRecord(models.Model):
    source_type = models.CharField(max_length=20, choices=UploadBatch.SourceType.choices)
    upload_batch = models.ForeignKey(
        UploadBatch,
        on_delete=models.PROTECT,
        related_name="records",
    )
    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="registry_records",
    )
    dedupe_key = models.CharField(max_length=64, unique=True, db_index=True)
    raw_data = models.JSONField(default=dict)

    region = models.CharField(max_length=255, blank=True)
    dealer = models.CharField(max_length=255, blank=True)
    trade_point = models.CharField(max_length=255, blank=True)
    client_name = models.CharField(max_length=255, db_index=True)
    document_type = models.CharField(max_length=255, blank=True)
    document_number = models.CharField(max_length=100, blank=True, db_index=True)
    birth_date = models.DateField(null=True, blank=True)
    tariff_plan = models.CharField(max_length=255, blank=True)
    status = models.CharField(max_length=255, blank=True)
    identification_method = models.CharField(max_length=255, blank=True)
    operator_full_name = models.CharField(max_length=255, blank=True)
    operator_login = models.CharField(max_length=150, blank=True)
    payment_amount = models.DecimalField(max_digits=14, decimal_places=2, null=True, blank=True)

    standard = models.CharField(max_length=100, blank=True)
    phone_number = models.CharField(max_length=50, blank=True, db_index=True)
    sim_card_number = models.CharField(max_length=100, blank=True)
    contract_number = models.CharField(max_length=100, blank=True, db_index=True)
    connection_date = models.DateTimeField(null=True, blank=True)

    technology = models.CharField(max_length=100, blank=True)
    internet_login = models.CharField(max_length=100, blank=True, db_index=True)
    ip_phone = models.CharField(max_length=100, blank=True)
    account_number = models.CharField(max_length=100, blank=True)
    modem_model = models.CharField(max_length=255, blank=True)
    modem_serial = models.CharField(max_length=255, blank=True)
    modem_cost = models.DecimalField(max_digits=14, decimal_places=2, null=True, blank=True)
    transfer_type = models.CharField(max_length=255, blank=True)
    contract_date = models.DateTimeField(null=True, blank=True)
    error_text = models.TextField(blank=True)
    request_number = models.CharField(max_length=100, blank=True, db_index=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ("-created_at", "-id")
        indexes = [
            models.Index(fields=["source_type", "created_at"], name="records_reg_source__fd79c1_idx"),
            models.Index(fields=["uploaded_by", "created_at"], name="records_reg_uploade_f79ecd_idx"),
        ]

    def __str__(self):
        return self.client_name
