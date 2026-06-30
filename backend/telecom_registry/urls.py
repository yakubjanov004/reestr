from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

from accounts.views import (
    AuditLogListView,
    MeView,
    OperatorViewSet,
    OrganizationOptionsView,
    PasswordChangeView,
    SmsLoginStartView,
    SmsLoginVerifyView,
)
from records.views import (
    AnnouncementListCreateView,
    BatchListView,
    RecordDetailView,
    RecordFilterOptionsView,
    RecordListView,
    StatsView,
    UploadExcelView,
)

router = DefaultRouter()
router.register("operators", OperatorViewSet, basename="operators")

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/token/", SmsLoginStartView.as_view(), name="token_obtain_pair"),
    path("api/auth/token/verify/", SmsLoginVerifyView.as_view(), name="token_verify_sms"),
    path("api/auth/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/users/me/", MeView.as_view(), name="me"),
    path("api/users/me/password/", PasswordChangeView.as_view(), name="me_password_change"),
    path("api/organization/options/", OrganizationOptionsView.as_view(), name="organization_options"),
    path("api/audit-logs/", AuditLogListView.as_view(), name="audit_log_list"),
    path("api/announcements/", AnnouncementListCreateView.as_view(), name="announcement_list_create"),
    path("api/", include(router.urls)),
    path("api/records/upload/", UploadExcelView.as_view(), name="upload_excel"),
    path("api/records/stats/", StatsView.as_view(), name="records_stats"),
    path("api/records/filter-options/", RecordFilterOptionsView.as_view(), name="record_filter_options"),
    path("api/records/batches/", BatchListView.as_view(), name="batch_list"),
    path("api/records/<int:pk>/", RecordDetailView.as_view(), name="record_detail"),
    path("api/records/", RecordListView.as_view(), name="record_list"),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
