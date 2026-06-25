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
    assigned_region = models.ForeignKey(
        "accounts.Region",
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name="upload_batches",
    )
    assigned_branch = models.ForeignKey(
        "accounts.Branch",
        on_delete=models.PROTECT,
        null=True,
        blank=True,
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
    assigned_region = models.ForeignKey(
        "accounts.Region",
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name="registry_records",
    )
    assigned_branch = models.ForeignKey(
        "accounts.Branch",
        on_delete=models.PROTECT,
        null=True,
        blank=True,
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
            models.Index(fields=["assigned_region", "created_at"], name="records_reg_region_72429c_idx"),
            models.Index(fields=["assigned_branch", "created_at"], name="records_reg_branch_c95de4_idx"),
        ]

    def __str__(self):
        return self.client_name


class Announcement(models.Model):
    class Target(models.TextChoices):
        ALL = "all", "All users"
        SUPERVISOR = "supervisor", "Supervisors"
        OPERATOR = "operator", "Operators"

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="announcements",
    )
    assigned_region = models.ForeignKey(
        "accounts.Region",
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name="announcements",
    )
    assigned_branch = models.ForeignKey(
        "accounts.Branch",
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name="announcements",
    )
    title = models.CharField(max_length=180)
    body = models.TextField()
    target = models.CharField(max_length=20, choices=Target.choices, default=Target.ALL)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ("-created_at", "-id")
        indexes = [
            models.Index(fields=["target", "created_at"], name="records_ann_target_8b2b70_idx"),
            models.Index(fields=["assigned_region", "created_at"], name="records_ann_region_3c5b62_idx"),
            models.Index(fields=["assigned_branch", "created_at"], name="records_ann_branch_5e6f4a_idx"),
        ]

    def __str__(self):
        return self.title
