from rest_framework import status, viewsets
from rest_framework.generics import ListAPIView, RetrieveUpdateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView

from .audit import log_audit_event
from .models import AuditLog, User
from .permissions import IsManager
from .serializers import (
    AuditLogSerializer,
    CustomTokenObtainPairSerializer,
    OperatorCreateUpdateSerializer,
    PasswordChangeSerializer,
    SelfProfileSerializer,
    UserSerializer,
)


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


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


class OperatorViewSet(viewsets.ModelViewSet):
    permission_classes = [IsManager]

    def get_queryset(self):
        return User.objects.filter(role__in=(User.Role.OPERATOR, User.Role.MANAGER)).order_by("-date_joined")

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
            metadata={"username": operator.username, "role": operator.role},
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
    permission_classes = [IsManager]
    serializer_class = AuditLogSerializer

    def get_queryset(self):
        queryset = AuditLog.objects.select_related("actor")
        action = self.request.query_params.get("action")
        actor = self.request.query_params.get("actor")
        if action:
            queryset = queryset.filter(action=action)
        if actor and actor.isdigit():
            queryset = queryset.filter(actor_id=actor)
        return queryset
