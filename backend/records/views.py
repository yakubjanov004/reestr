from datetime import datetime, time, timedelta

from django.db.models import Count, Max, Q, Sum
from django.db.models.functions import TruncDate
from django.utils import timezone
from rest_framework import filters, generics, status
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.audit import log_audit_event
from accounts.models import User
from .models import RegistryRecord, UploadBatch
from .serializers import RegistryRecordDetailSerializer, RegistryRecordSerializer, UploadBatchSerializer
from .services import import_excel_file


class ScopedQuerysetMixin:
    def scope_queryset(self, queryset):
        user = self.request.user
        if user.is_manager:
            return queryset
        return queryset.filter(uploaded_by=user)


def parse_day_param(value, *, end=False):
    if not value:
        return None
    try:
        parsed = datetime.strptime(value, "%Y-%m-%d").date()
    except ValueError:
        return None
    day_time = time.max if end else time.min
    return timezone.make_aware(
        datetime.combine(parsed, day_time),
        timezone.get_current_timezone(),
    )


def apply_date_filters(queryset, params):
    date_from = parse_day_param(params.get("date_from"))
    date_to = parse_day_param(params.get("date_to"), end=True)
    if date_from:
        queryset = queryset.filter(created_at__gte=date_from)
    if date_to:
        queryset = queryset.filter(created_at__lte=date_to)
    return queryset


def apply_record_filters(queryset, request):
    params = request.query_params
    queryset = apply_date_filters(queryset, params)

    source_type = params.get("source_type")
    if source_type in {UploadBatch.SourceType.MOBILE, UploadBatch.SourceType.INTERNET}:
        queryset = queryset.filter(source_type=source_type)

    uploaded_by = params.get("uploaded_by")
    if request.user.is_manager and uploaded_by and uploaded_by.isdigit():
        queryset = queryset.filter(uploaded_by_id=uploaded_by)

    for field_name in ("region", "dealer", "status"):
        value = (params.get(field_name) or "").strip()
        if value:
            queryset = queryset.filter(**{f"{field_name}__icontains": value})

    return queryset


class UploadExcelView(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        upload = request.FILES.get("file")
        source_type = request.data.get("source_type")
        allowed_source_types = {UploadBatch.SourceType.MOBILE, UploadBatch.SourceType.INTERNET}
        if source_type not in allowed_source_types:
            return Response(
                {"detail": "Excel turi tanlanishi kerak: mobile yoki internet."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if not upload:
            return Response({"detail": "Excel fayl yuborilmadi."}, status=status.HTTP_400_BAD_REQUEST)
        if not upload.name.lower().endswith((".xlsx", ".xlsm")):
            return Response({"detail": "Faqat .xlsx yoki .xlsm fayl qabul qilinadi."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            batch = import_excel_file(
                file_obj=upload,
                uploaded_by=request.user,
                expected_source_type=source_type,
            )
        except ValueError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)

        log_audit_event(
            actor=request.user,
            action="upload_created",
            target=batch,
            target_label=batch.original_filename,
            metadata={
                "source_type": batch.source_type,
                "rows_in_file": batch.rows_in_file,
                "imported_count": batch.imported_count,
                "duplicate_count": batch.duplicate_count,
                "skipped_count": batch.skipped_count,
            },
        )

        return Response(UploadBatchSerializer(batch).data, status=status.HTTP_201_CREATED)


class StatsView(ScopedQuerysetMixin, APIView):
    def get(self, request):
        records = self.scope_queryset(RegistryRecord.objects.all())
        batches = self.scope_queryset(UploadBatch.objects.all())

        uploaded_by = request.query_params.get("uploaded_by")
        if request.user.is_manager and uploaded_by and uploaded_by.isdigit():
            records = records.filter(uploaded_by_id=uploaded_by)
            batches = batches.filter(uploaded_by_id=uploaded_by)

        now = timezone.localtime()
        month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        last_7_start = now - timedelta(days=7)
        last_30_start = now - timedelta(days=30)

        by_day = (
            records.filter(created_at__gte=month_start)
            .annotate(day=TruncDate("created_at"))
            .values("day")
            .annotate(count=Count("id"))
            .order_by("day")
        )
        by_day_30 = (
            records.filter(created_at__gte=last_30_start)
            .annotate(day=TruncDate("created_at"))
            .values("day")
            .annotate(count=Count("id"))
            .order_by("day")
        )
        last_180_start = now - timedelta(days=180)
        by_day_180 = (
            records.filter(created_at__gte=last_180_start)
            .annotate(day=TruncDate("created_at"))
            .values("day")
            .annotate(count=Count("id"))
            .order_by("day")
        )
        region_summary = (
            records.exclude(region="")
            .values("region")
            .annotate(count=Count("id"))
            .order_by("-count", "region")[:10]
        )
        status_summary = (
            records.exclude(status="")
            .values("status")
            .annotate(count=Count("id"))
            .order_by("-count", "status")[:10]
        )
        batch_totals = batches.aggregate(
            total_rows_in_files=Sum("rows_in_file"),
            total_imported_rows=Sum("imported_count"),
            total_duplicate_rows=Sum("duplicate_count"),
            total_skipped_rows=Sum("skipped_count"),
            last_upload_at=Max("created_at"),
        )

        recent_batches = batches.select_related("uploaded_by")[:8]
        source_summary = {}
        for source_type, label in (
            (UploadBatch.SourceType.MOBILE, "Mobil raqam"),
            (UploadBatch.SourceType.INTERNET, "Internet ulanish"),
        ):
            source_records = records.filter(source_type=source_type)
            source_batches = batches.filter(source_type=source_type)
            source_batch_totals = source_batches.aggregate(
                imported_rows=Sum("imported_count"),
                duplicate_rows=Sum("duplicate_count"),
                skipped_rows=Sum("skipped_count"),
                rows_in_files=Sum("rows_in_file"),
            )
            source_summary[source_type] = {
                "label": label,
                "records": source_records.count(),
                "uploads": source_batches.count(),
                "imported_this_month": source_records.filter(created_at__gte=month_start).count(),
                "imported_rows": source_batch_totals["imported_rows"] or 0,
                "duplicate_rows": source_batch_totals["duplicate_rows"] or 0,
                "skipped_rows": source_batch_totals["skipped_rows"] or 0,
                "rows_in_files": source_batch_totals["rows_in_files"] or 0,
            }
        total_revenue = records.aggregate(total=Sum("payment_amount"))["total"] or 0
        if request.user.is_manager:
            total_operators = User.objects.filter(role=User.Role.OPERATOR).count()
            active_operators = User.objects.filter(role=User.Role.OPERATOR, is_active=True).count()
        else:
            total_operators = 1
            active_operators = 1 if request.user.is_active else 0

        data = {
            "total_records": records.count(),
            "total_uploads": batches.count(),
            "uploads_this_month": batches.filter(created_at__gte=month_start).count(),
            "uploads_last_7": batches.filter(created_at__gte=last_7_start).count(),
            "uploads_last_30": batches.filter(created_at__gte=last_30_start).count(),
            "total_revenue": total_revenue,
            "total_rows_in_files": batch_totals["total_rows_in_files"] or 0,
            "total_imported_rows": batch_totals["total_imported_rows"] or 0,
            "total_duplicate_rows": batch_totals["total_duplicate_rows"] or 0,
            "total_skipped_rows": batch_totals["total_skipped_rows"] or 0,
            "last_upload_at": (
                batch_totals["last_upload_at"].isoformat()
                if batch_totals["last_upload_at"]
                else None
            ),
            "total_operators": total_operators,
            "active_operators": active_operators,
            "imported_this_month": records.filter(created_at__gte=month_start).count(),
            "records_last_7": records.filter(created_at__gte=last_7_start).count(),
            "records_last_30": records.filter(created_at__gte=last_30_start).count(),
            "records_by_day": [
                {"date": item["day"].isoformat(), "count": item["count"]} for item in by_day
            ],
            "records_by_day_30": [
                {"date": item["day"].isoformat(), "count": item["count"]} for item in by_day_30
            ],
            "records_by_day_180": [
                {"date": item["day"].isoformat(), "count": item["count"]} for item in by_day_180
            ],
            "region_summary": list(region_summary),
            "status_summary": list(status_summary),
            "source_summary": source_summary,
            "recent_batches": UploadBatchSerializer(recent_batches, many=True).data,
        }

        if request.user.is_manager:
            yesterday = timezone.localdate() - timedelta(days=1)
            day_start = timezone.make_aware(
                datetime.combine(yesterday, time.min),
                timezone.get_current_timezone(),
            )
            day_end = day_start + timedelta(days=1)
            operator_rows = (
                User.objects.filter(role=User.Role.OPERATOR)
                .annotate(
                    records_count=Count("registry_records", distinct=True),
                    uploads_count=Count(
                        "upload_batches",
                        distinct=True,
                    ),
                    total_revenue=Sum("registry_records__payment_amount"),
                )
                .order_by("username")
            )
            data["operators"] = [
                {
                    "id": operator.id,
                    "username": operator.username,
                    "full_name": operator.get_full_name() or operator.username,
                    "records_count": operator.records_count,
                    "uploads_count": operator.uploads_count,
                    "total_revenue": operator.total_revenue or 0,
                    "is_active": operator.is_active,
                }
                for operator in operator_rows
            ]
            missing_yesterday = (
                User.objects.filter(role=User.Role.OPERATOR, is_active=True)
                .exclude(
                    upload_batches__created_at__gte=day_start,
                    upload_batches__created_at__lt=day_end,
                )
                .order_by("username")
            )
            data["upload_alerts"] = {
                "date": yesterday.isoformat(),
                "missing_yesterday": [
                    {
                        "id": operator.id,
                        "username": operator.username,
                        "full_name": operator.get_full_name() or operator.username,
                    }
                    for operator in missing_yesterday
                ],
            }
            ranking_rows = (
                User.objects.filter(role=User.Role.OPERATOR)
                .annotate(
                    records_count=Count(
                        "registry_records",
                        filter=Q(registry_records__created_at__gte=last_30_start),
                        distinct=True,
                    ),
                    uploads_count=Count(
                        "upload_batches",
                        filter=Q(upload_batches__created_at__gte=last_30_start),
                        distinct=True,
                    ),
                    total_revenue=Sum(
                        "registry_records__payment_amount",
                        filter=Q(registry_records__created_at__gte=last_30_start),
                    ),
                )
                .order_by("-records_count", "username")[:10]
            )
            data["operator_ranking"] = [
                {
                    "id": operator.id,
                    "username": operator.username,
                    "full_name": operator.get_full_name() or operator.username,
                    "records_count": operator.records_count,
                    "uploads_count": operator.uploads_count,
                    "total_revenue": operator.total_revenue or 0,
                }
                for operator in ranking_rows
            ]

        return Response(data)


class RecordFilterOptionsView(ScopedQuerysetMixin, APIView):
    def get(self, request):
        records = apply_record_filters(
            self.scope_queryset(RegistryRecord.objects.all()),
            request,
        )

        def distinct_values(field_name):
            return list(
                records.exclude(**{field_name: ""})
                .order_by(field_name)
                .values_list(field_name, flat=True)
                .distinct()[:100]
            )

        data = {
            "regions": distinct_values("region"),
            "dealers": distinct_values("dealer"),
            "statuses": distinct_values("status"),
            "operators": [],
        }
        if request.user.is_manager:
            data["operators"] = [
                {
                    "id": operator.id,
                    "username": operator.username,
                    "full_name": operator.get_full_name() or operator.username,
                }
                for operator in User.objects.filter(role=User.Role.OPERATOR).order_by("username")
            ]
        return Response(data)


class BatchListView(ScopedQuerysetMixin, generics.ListAPIView):
    serializer_class = UploadBatchSerializer

    def get_queryset(self):
        queryset = self.scope_queryset(UploadBatch.objects.select_related("uploaded_by"))
        queryset = apply_date_filters(queryset, self.request.query_params)
        source_type = self.request.query_params.get("source_type")
        if source_type in {UploadBatch.SourceType.MOBILE, UploadBatch.SourceType.INTERNET}:
            queryset = queryset.filter(source_type=source_type)
        uploaded_by = self.request.query_params.get("uploaded_by")
        if self.request.user.is_manager and uploaded_by and uploaded_by.isdigit():
            queryset = queryset.filter(uploaded_by_id=uploaded_by)
        return queryset


class RecordListView(ScopedQuerysetMixin, generics.ListAPIView):
    serializer_class = RegistryRecordSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = [
        "client_name",
        "phone_number",
        "internet_login",
        "request_number",
    ]
    ordering_fields = ["created_at", "client_name", "connection_date", "contract_date"]
    ordering = ["-created_at"]

    def get_queryset(self):
        queryset = self.scope_queryset(
            RegistryRecord.objects.select_related("uploaded_by", "upload_batch")
        )
        return apply_record_filters(queryset, self.request)


class RecordDetailView(ScopedQuerysetMixin, generics.RetrieveAPIView):
    serializer_class = RegistryRecordDetailSerializer

    def get_queryset(self):
        return self.scope_queryset(
            RegistryRecord.objects.select_related("uploaded_by", "upload_batch")
        )
