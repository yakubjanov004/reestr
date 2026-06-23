import logging

from .models import AuditLog


logger = logging.getLogger(__name__)


def log_audit_event(*, actor, action, target=None, target_label="", metadata=None):
    target_type = ""
    target_id = ""
    if target is not None:
        target_type = target.__class__.__name__
        target_id = str(getattr(target, "pk", "") or "")
        if not target_label:
            target_label = str(target)

    audit_log = AuditLog.objects.create(
        actor=actor if getattr(actor, "is_authenticated", False) else None,
        action=action,
        target_type=target_type,
        target_id=target_id,
        target_label=target_label,
        metadata=metadata or {},
    )
    logger.info(
        "audit action=%s actor=%s target=%s:%s label=%s",
        action,
        getattr(actor, "username", ""),
        target_type,
        target_id,
        target_label,
    )
    return audit_log
