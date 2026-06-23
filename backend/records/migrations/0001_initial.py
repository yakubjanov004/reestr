import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="UploadBatch",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("file", models.FileField(upload_to="uploads/%Y/%m/%d/")),
                ("original_filename", models.CharField(max_length=255)),
                ("source_type", models.CharField(choices=[("mobile", "GSM"), ("internet", "SHPD"), ("unknown", "Unknown")], default="unknown", max_length=20)),
                ("period_start", models.DateTimeField(blank=True, null=True)),
                ("period_end", models.DateTimeField(blank=True, null=True)),
                ("rows_in_file", models.PositiveIntegerField(default=0)),
                ("imported_count", models.PositiveIntegerField(default=0)),
                ("duplicate_count", models.PositiveIntegerField(default=0)),
                ("skipped_count", models.PositiveIntegerField(default=0)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("uploaded_by", models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name="upload_batches", to=settings.AUTH_USER_MODEL)),
            ],
            options={
                "ordering": ("-created_at",),
            },
        ),
        migrations.CreateModel(
            name="RegistryRecord",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("source_type", models.CharField(choices=[("mobile", "GSM"), ("internet", "SHPD"), ("unknown", "Unknown")], max_length=20)),
                ("dedupe_key", models.CharField(db_index=True, max_length=64, unique=True)),
                ("raw_data", models.JSONField(default=dict)),
                ("region", models.CharField(blank=True, max_length=255)),
                ("dealer", models.CharField(blank=True, max_length=255)),
                ("trade_point", models.CharField(blank=True, max_length=255)),
                ("client_name", models.CharField(db_index=True, max_length=255)),
                ("document_type", models.CharField(blank=True, max_length=255)),
                ("document_number", models.CharField(blank=True, db_index=True, max_length=100)),
                ("birth_date", models.DateField(blank=True, null=True)),
                ("tariff_plan", models.CharField(blank=True, max_length=255)),
                ("status", models.CharField(blank=True, max_length=255)),
                ("identification_method", models.CharField(blank=True, max_length=255)),
                ("operator_full_name", models.CharField(blank=True, max_length=255)),
                ("operator_login", models.CharField(blank=True, max_length=150)),
                ("payment_amount", models.DecimalField(blank=True, decimal_places=2, max_digits=14, null=True)),
                ("standard", models.CharField(blank=True, max_length=100)),
                ("phone_number", models.CharField(blank=True, db_index=True, max_length=50)),
                ("sim_card_number", models.CharField(blank=True, max_length=100)),
                ("contract_number", models.CharField(blank=True, db_index=True, max_length=100)),
                ("connection_date", models.DateTimeField(blank=True, null=True)),
                ("technology", models.CharField(blank=True, max_length=100)),
                ("internet_login", models.CharField(blank=True, db_index=True, max_length=100)),
                ("ip_phone", models.CharField(blank=True, max_length=100)),
                ("account_number", models.CharField(blank=True, max_length=100)),
                ("modem_model", models.CharField(blank=True, max_length=255)),
                ("modem_serial", models.CharField(blank=True, max_length=255)),
                ("modem_cost", models.DecimalField(blank=True, decimal_places=2, max_digits=14, null=True)),
                ("transfer_type", models.CharField(blank=True, max_length=255)),
                ("contract_date", models.DateTimeField(blank=True, null=True)),
                ("error_text", models.TextField(blank=True)),
                ("request_number", models.CharField(blank=True, db_index=True, max_length=100)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("upload_batch", models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name="records", to="records.uploadbatch")),
                ("uploaded_by", models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name="registry_records", to=settings.AUTH_USER_MODEL)),
            ],
            options={
                "ordering": ("-created_at", "-id"),
            },
        ),
        migrations.AddIndex(
            model_name="registryrecord",
            index=models.Index(fields=["source_type", "created_at"], name="records_reg_source__fd79c1_idx"),
        ),
        migrations.AddIndex(
            model_name="registryrecord",
            index=models.Index(fields=["uploaded_by", "created_at"], name="records_reg_uploade_f79ecd_idx"),
        ),
    ]
