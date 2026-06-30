from django.db.models import Q
from rest_framework import status, viewsets
from rest_framework.generics import ListAPIView, RetrieveUpdateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .audit import log_audit_event
from .models import AuditLog, Branch, LoginTrustedDevice, Region, User
from .permissions import CanManageUsers
from .serializers import (
    AuditLogSerializer,
    BranchSerializer,
    OperatorCreateUpdateSerializer,
    PasswordChangeSerializer,
    RegionSerializer,
    SelfProfileSerializer,
    SmsLoginStartSerializer,
    SmsLoginVerifySerializer,
    UserSerializer,
)


class SmsLoginStartView(APIView):
    permission_classes = []

    def post(self, request):
        serializer = SmsLoginStartSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        return Response(serializer.save(), status=status.HTTP_200_OK)


class SmsLoginVerifyView(APIView):
    permission_classes = []

    def post(self, request):
        serializer = SmsLoginVerifySerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        return Response(serializer.save(), status=status.HTTP_200_OK)


class MeView(RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = SelfProfileSerializer

    def get_object(self):
        return self.request.user

    def perform_update(self, serializer):
        changed_fields = sorted(serializer.validated_data.keys())
        user = serializer.save()
        if changed_fields:
            log_audit_event(
                actor=self.request.user,
                action="self_profile_updated",
                target=user,
                metadata={"changed_fields": changed_fields},
            )


class PasswordChangeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = PasswordChangeSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        log_audit_event(
            actor=request.user,
            action="self_password_changed",
            target=user,
        )
        return Response({"detail": "Parol yangilandi."}, status=status.HTTP_200_OK)


def manageable_user_queryset(user):
    queryset = User.objects.select_related("region", "branch", "branch__region").order_by("-date_joined")
    if user.is_admin_role:
        return queryset.filter(
            role__in=(User.Role.OPERATOR, User.Role.SUPERVISOR, User.Role.MANAGER, User.Role.ADMIN)
        )
    if user.role == User.Role.MANAGER:
        return queryset.filter(role__in=(User.Role.OPERATOR, User.Role.SUPERVISOR))
    if user.role == User.Role.SUPERVISOR and user.effective_region_id:
        return queryset.filter(
            Q(role=User.Role.OPERATOR),
            Q(region_id=user.effective_region_id) | Q(branch__region_id=user.effective_region_id),
        ).distinct()
    return queryset.none()


def creatable_roles(user):
    if user.is_admin_role:
        return [User.Role.MANAGER]
    if user.role == User.Role.MANAGER:
        return [User.Role.SUPERVISOR, User.Role.OPERATOR]
    if user.role == User.Role.SUPERVISOR:
        return [User.Role.OPERATOR]
    return []


class OperatorViewSet(viewsets.ModelViewSet):
    permission_classes = [CanManageUsers]

    def get_queryset(self):
        return manageable_user_queryset(self.request.user)

    def get_serializer_class(self):
        if self.action in {"create", "update", "partial_update"}:
            return OperatorCreateUpdateSerializer
        return UserSerializer

    def perform_create(self, serializer):
        operator = serializer.save()
        log_audit_event(
            actor=self.request.user,
            action="operator_created",
            target=operator,
            metadata={
                "username": operator.username,
                "role": operator.role,
                "region": operator.region.name if operator.region else "",
                "branch": operator.branch.name if operator.branch else "",
            },
        )

    def perform_update(self, serializer):
        previous_is_active = serializer.instance.is_active
        changed_fields = sorted(serializer.validated_data.keys())
        password_changed = "password" in serializer.validated_data
        operator = serializer.save()

        if previous_is_active != operator.is_active:
            log_audit_event(
                actor=self.request.user,
                action="operator_status_changed",
                target=operator,
                metadata={"is_active": operator.is_active},
            )
            if not operator.is_active:
                LoginTrustedDevice.objects.filter(user=operator).update(is_active=False)
        if password_changed:
            log_audit_event(
                actor=self.request.user,
                action="operator_password_changed",
                target=operator,
            )
        profile_fields = sorted(set(changed_fields) - {"password", "is_active"})
        if profile_fields:
            log_audit_event(
                actor=self.request.user,
                action="operator_updated",
                target=operator,
                metadata={"changed_fields": profile_fields},
            )


class AuditLogListView(ListAPIView):
    permission_classes = [CanManageUsers]
    serializer_class = AuditLogSerializer

    def get_queryset(self):
        queryset = AuditLog.objects.select_related("actor")
        user = self.request.user
        if user.is_admin_role:
            pass
        elif user.role == User.Role.MANAGER:
            lower_user_ids = User.objects.filter(
                role__in=(User.Role.SUPERVISOR, User.Role.OPERATOR)
            ).values_list("id", flat=True)
            lower_target_ids = [str(user_id) for user_id in lower_user_ids]
            queryset = queryset.filter(
                Q(actor__role__in=(User.Role.SUPERVISOR, User.Role.OPERATOR))
                | Q(target_type="User", target_id__in=lower_target_ids)
            )
        elif user.role == User.Role.SUPERVISOR and user.effective_region_id:
            lower_users = User.objects.filter(
                Q(role=User.Role.OPERATOR),
                Q(region_id=user.effective_region_id) | Q(branch__region_id=user.effective_region_id),
            )
            lower_user_ids = lower_users.values_list("id", flat=True)
            lower_target_ids = [str(user_id) for user_id in lower_user_ids]
            queryset = queryset.filter(
                (
                    Q(actor__role=User.Role.OPERATOR)
                    & (Q(actor__region_id=user.effective_region_id) | Q(actor__branch__region_id=user.effective_region_id))
                )
                | Q(target_type="User", target_id__in=lower_target_ids)
            )
        else:
            queryset = queryset.none()
        action = self.request.query_params.get("action")
        actor = self.request.query_params.get("actor")
        if action:
            queryset = queryset.filter(action=action)
        if actor and actor.isdigit():
            queryset = queryset.filter(actor_id=actor)
        return queryset


class OrganizationOptionsView(APIView):
    permission_classes = [CanManageUsers]

    def get(self, request):
        user = request.user
        if user.is_supervisor:
            regions = Region.objects.filter(id=user.effective_region_id) if user.effective_region_id else Region.objects.none()
            branches = (
                Branch.objects.filter(region_id=user.effective_region_id, is_active=True)
                if user.effective_region_id
                else Branch.objects.none()
            )
        else:
            regions = Region.objects.all()
            branches = Branch.objects.select_related("region").filter(is_active=True)

        return Response(
            {
                "roles": creatable_roles(user),
                "regions": RegionSerializer(regions, many=True).data,
                "branches": BranchSerializer(branches, many=True).data,
            }
        )
