from rest_framework import serializers

from .models import RegistryRecord, UploadBatch


class UploadBatchSerializer(serializers.ModelSerializer):
    uploaded_by_username = serializers.CharField(source="uploaded_by.username", read_only=True)
    import_error_count = serializers.SerializerMethodField()

    def get_import_error_count(self, obj):
        return len(obj.import_errors or [])

    class Meta:
        model = UploadBatch
        fields = (
            "id",
            "uploaded_by",
            "uploaded_by_username",
            "original_filename",
            "source_type",
            "period_start",
            "period_end",
            "rows_in_file",
            "imported_count",
            "duplicate_count",
            "skipped_count",
            "import_errors",
            "import_error_count",
            "created_at",
        )
        read_only_fields = fields


class RegistryRecordSerializer(serializers.ModelSerializer):
    uploaded_by_username = serializers.CharField(source="uploaded_by.username", read_only=True)

    class Meta:
        model = RegistryRecord
        fields = (
            "id",
            "source_type",
            "uploaded_by_username",
            "region",
            "dealer",
            "client_name",
            "tariff_plan",
            "status",
            "identification_method",
            "operator_full_name",
            "payment_amount",
            "phone_number",
            "connection_date",
            "internet_login",
            "modem_model",
            "modem_cost",
            "transfer_type",
            "contract_date",
            "request_number",
            "created_at",
        )
        read_only_fields = fields


class RegistryRecordDetailSerializer(serializers.ModelSerializer):
    uploaded_by_username = serializers.CharField(source="uploaded_by.username", read_only=True)
    upload_batch_filename = serializers.CharField(source="upload_batch.original_filename", read_only=True)
    upload_batch_created_at = serializers.DateTimeField(source="upload_batch.created_at", read_only=True)
    upload_batch_period_start = serializers.DateTimeField(source="upload_batch.period_start", read_only=True)
    upload_batch_period_end = serializers.DateTimeField(source="upload_batch.period_end", read_only=True)

    class Meta:
        model = RegistryRecord
        fields = (
            "id",
            "source_type",
            "uploaded_by_username",
            "upload_batch",
            "upload_batch_filename",
            "upload_batch_created_at",
            "upload_batch_period_start",
            "upload_batch_period_end",
            "region",
            "dealer",
            "trade_point",
            "client_name",
            "document_type",
            "document_number",
            "birth_date",
            "tariff_plan",
            "status",
            "identification_method",
            "operator_full_name",
            "operator_login",
            "payment_amount",
            "standard",
            "phone_number",
            "sim_card_number",
            "contract_number",
            "connection_date",
            "technology",
            "internet_login",
            "ip_phone",
            "account_number",
            "modem_model",
            "modem_serial",
            "modem_cost",
            "transfer_type",
            "contract_date",
            "error_text",
            "request_number",
            "created_at",
        )
        read_only_fields = fields
