import os
import re
import sys
from datetime import timedelta
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent.parent
PROJECT_DIR = BASE_DIR.parent
DATA_DIR = PROJECT_DIR / "data"
SCRIPTS_DIR = BASE_DIR / "scripts"
sys.path.append(str(BASE_DIR))
sys.path.append(str(SCRIPTS_DIR))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "telecom_registry.settings")

from create_database import main as ensure_database  # noqa: E402


REGION_NAME = "Toshkent shahri"
SEED_PREFIX = "seed-"
SEED_IMPORT_PREFIX = "seed_data_"
SEED_BATCH_PREFIX = "seed_"
LEGACY_SEED_USERS = ("shahnoza.norova",)
LEGACY_SEED_BATCHES = (
    "novza_gsm_haftalik.xlsx",
    "novza_shpd_haftalik.xlsx",
    "sergeli_gsm_haftalik.xlsx",
    "sergeli_shpd_haftalik.xlsx",
)
LEGACY_SEED_ANNOUNCEMENTS = (
    "Supervisorlar uchun eslatma",
)

BRANCHES = (
    {"name": "Novza metro", "code": "NOVZA"},
    {"name": "Sergeli Mediapark", "code": "SERGELI"},
)

INITIAL_USERS = (
    {
        "username": "azizbek.karimov",
        "password": "Azizbek2026!",
        "first_name": "Azizbek",
        "last_name": "Karimov",
        "role": "operator",
        "branch": "Novza metro",
        "is_staff": False,
        "is_superuser": False,
    },
    {
        "username": "dilshod.rahimov",
        "password": "Dilshod2026!",
        "first_name": "Dilshod",
        "last_name": "Rahimov",
        "role": "supervisor",
        "branch": None,
        "is_staff": True,
        "is_superuser": False,
    },
    {
        "username": "malika.abdullayeva",
        "password": "Malika2026!",
        "first_name": "Malika",
        "last_name": "Abdullayeva",
        "role": "manager",
        "branch": None,
        "is_staff": True,
        "is_superuser": False,
    },
    {
        "username": "sardor.yusupov",
        "password": "Sardor2026!",
        "first_name": "Sardor",
        "last_name": "Yusupov",
        "role": "admin",
        "branch": None,
        "is_staff": True,
        "is_superuser": True,
    },
)

ANNOUNCEMENT_SEEDS = (
    {
        "title": "Haftalik reestr nazorati",
        "body": "Filiallar bo'yicha yuklangan reestrlar soni va dublikat qatorlarni kun yakunida tekshiring.",
        "target": "all",
        "created_by": "malika.abdullayeva",
        "days_ago": 10,
    },
    {
        "title": "Supervisorlar uchun import rejasi",
        "body": "Operator yuklagan GSM va SHPD fayllarini filial kesimida ko'rib chiqing.",
        "target": "supervisor",
        "created_by": "malika.abdullayeva",
        "days_ago": 7,
    },
    {
        "title": "Operator uchun kunlik eslatma",
        "body": "Reestr fayllarini bir xil formatda yuklang va xatoli qatorlarni qayta tekshiring.",
        "target": "operator",
        "created_by": "dilshod.rahimov",
        "days_ago": 5,
    },
    {
        "title": "KPI summalarini tekshirish",
        "body": "Summa maydoni bo'sh qolgan yozuvlar KPI hisobiga kirmaydi.",
        "target": "all",
        "created_by": "malika.abdullayeva",
        "days_ago": 3,
    },
    {
        "title": "Bugungi yuklash bo'yicha xabar",
        "body": "Ish kuni yakunigacha Novza metro va Sergeli Mediapark bo'yicha importlarni tekshirib chiqing.",
        "target": "operator",
        "created_by": "dilshod.rahimov",
        "days_ago": 1,
    },
)


def setup_django():
    import django

    django.setup()


def run_migrations():
    from django.core.management import call_command

    call_command("migrate", interactive=False)


def print_status(kind, label, created):
    action = "created" if created else "updated"
    print(f"{kind}: {label} - {action}")


def force_timestamps(model, instance, **timestamps):
    model.objects.filter(pk=instance.pk).update(**timestamps)
    for field, value in timestamps.items():
        setattr(instance, field, value)


def ensure_region(Region):
    region, created = Region.objects.get_or_create(name=REGION_NAME)
    print_status("region", region.name, created)
    return region


def ensure_branch(Branch, region, item):
    branch, created = Branch.objects.get_or_create(
        region=region,
        name=item["name"],
        defaults={"code": item["code"], "is_active": True},
    )
    branch.code = item["code"]
    branch.is_active = True
    branch.save(update_fields=["code", "is_active"])
    print_status("branch", f"{region.name} / {branch.name}", created)
    return branch


def ensure_user(User, region, branches_by_name, item):
    branch = branches_by_name.get(item["branch"]) if item["branch"] else None
    user, created = User.objects.get_or_create(username=item["username"])
    user.email = ""
    user.first_name = item["first_name"]
    user.last_name = item["last_name"]
    user.role = item["role"]
    user.region = branch.region if branch else region
    user.branch = branch
    user.is_staff = item["is_staff"]
    user.is_superuser = item["is_superuser"]
    user.is_active = True
    user.set_password(item["password"])
    user.save()
    print_status("user", f"{user.get_full_name()} ({user.username}, {user.role})", created)
    return user


def seed_batch_filter(Q):
    return (
        Q(original_filename__startswith=SEED_IMPORT_PREFIX)
        | Q(original_filename__startswith=SEED_BATCH_PREFIX)
        | Q(original_filename__in=LEGACY_SEED_BATCHES)
    )


def cleanup_seed_data(User, UploadBatch, RegistryRecord, Announcement, AuditLog):
    from django.db.models import Q

    batch_filter = seed_batch_filter(Q)
    deleted_records, _ = RegistryRecord.objects.filter(
        Q(dedupe_key__startswith=SEED_PREFIX) | Q(upload_batch__original_filename__startswith=SEED_IMPORT_PREFIX)
        | Q(upload_batch__original_filename__startswith=SEED_BATCH_PREFIX)
        | Q(upload_batch__original_filename__in=LEGACY_SEED_BATCHES)
    ).delete()

    seed_batches = list(UploadBatch.objects.filter(batch_filter))
    for batch in seed_batches:
        if batch.file:
            batch.file.delete(save=False)
    deleted_batches, _ = UploadBatch.objects.filter(batch_filter).delete()

    deleted_announcements, _ = Announcement.objects.filter(
        title__in=[item["title"] for item in ANNOUNCEMENT_SEEDS] + list(LEGACY_SEED_ANNOUNCEMENTS)
    ).delete()
    deleted_audit, _ = AuditLog.objects.filter(metadata__seed_key__startswith=SEED_PREFIX).delete()

    print(f"cleanup: {deleted_records} seed records removed")
    print(f"cleanup: {deleted_batches} seed batches removed")
    print(f"cleanup: {deleted_announcements} seed announcements removed")
    print(f"cleanup: {deleted_audit} seed audit logs removed")

    for username in LEGACY_SEED_USERS:
        user = User.objects.filter(username=username).first()
        if not user:
            continue
        if not user.registry_records.exists() and not user.upload_batches.exists():
            user.delete()
            print(f"cleanup: legacy seed user {username} removed")
        else:
            user.is_active = False
            user.save(update_fields=["is_active"])
            print(f"cleanup: legacy seed user {username} deactivated")


def data_files():
    if not DATA_DIR.exists():
        raise RuntimeError(f"Data papka topilmadi: {DATA_DIR}")
    return sorted(DATA_DIR.rglob("*.xlsx"), key=lambda path: str(path.relative_to(DATA_DIR)).lower())


def seed_original_filename(path):
    relative = path.relative_to(DATA_DIR)
    stem = "_".join(relative.with_suffix("").parts)
    slug = re.sub(r"[^A-Za-z0-9]+", "_", stem).strip("_").lower()
    return f"{SEED_IMPORT_PREFIX}{slug}{path.suffix.lower()}"


def branch_for_file(path, branches_by_name):
    relative_parts = {part.lower() for part in path.relative_to(DATA_DIR).parts}
    if {"data3", "data4"} & relative_parts:
        return branches_by_name["Sergeli Mediapark"]
    return branches_by_name["Novza metro"]


def spread_batch_dates(UploadBatch, RegistryRecord, batch, branch, region, order_index, total_files):
    from django.utils import timezone

    days_ago = max(total_files - order_index, 0) * 2
    created_at = timezone.now() - timedelta(days=days_ago, hours=order_index % 6)
    batch.assigned_region = region
    batch.assigned_branch = branch
    batch.save(update_fields=["assigned_region", "assigned_branch"])
    force_timestamps(UploadBatch, batch, created_at=created_at)

    records = list(batch.records.order_by("id"))
    for index, record in enumerate(records):
        record.assigned_region = region
        record.assigned_branch = branch
        record.created_at = created_at + timedelta(minutes=(index % 420) + 1)
    if records:
        RegistryRecord.objects.bulk_update(
            records,
            ["assigned_region", "assigned_branch", "created_at"],
            batch_size=500,
        )


def import_data_files(UploadBatch, RegistryRecord, operator, region, branches_by_name):
    from django.core.files import File
    from records.services import import_excel_file

    imported_batches = []
    files = data_files()
    for index, path in enumerate(files, start=1):
        branch = branch_for_file(path, branches_by_name)
        original_filename = seed_original_filename(path)
        with path.open("rb") as handle:
            upload = File(handle, name=original_filename)
            batch = import_excel_file(file_obj=upload, uploaded_by=operator)
        spread_batch_dates(UploadBatch, RegistryRecord, batch, branch, region, index, len(files))
        imported_batches.append(batch)
        print(
            "batch: "
            f"{original_filename} - imported {batch.imported_count}, "
            f"duplicate {batch.duplicate_count}, skipped {batch.skipped_count}"
        )
    return imported_batches


def seed_announcements(Announcement, region, users_by_username):
    from django.utils import timezone

    now = timezone.now()
    announcements = []
    for item in ANNOUNCEMENT_SEEDS:
        created_at = now - timedelta(days=item["days_ago"], minutes=20)
        announcement, created = Announcement.objects.update_or_create(
            title=item["title"],
            created_by=users_by_username[item["created_by"]],
            defaults={
                "body": item["body"],
                "target": item["target"],
                "assigned_region": region if item["target"] == "operator" else None,
                "assigned_branch": None,
                "is_active": True,
            },
        )
        force_timestamps(Announcement, announcement, created_at=created_at, updated_at=created_at)
        announcements.append(announcement)
        print_status("announcement", item["title"], created)
    return announcements


def create_audit(AuditLog, actor, action, target, label, created_at, metadata=None):
    metadata = metadata or {}
    metadata["seed_key"] = f"{SEED_PREFIX}{action}-{target.__class__.__name__.lower()}-{target.pk}"
    audit_log = AuditLog.objects.create(
        actor=actor,
        action=action,
        target_type=target.__class__.__name__,
        target_id=str(target.pk),
        target_label=label,
        metadata=metadata,
    )
    force_timestamps(AuditLog, audit_log, created_at=created_at)
    return audit_log


def seed_audit_logs(AuditLog, users_by_username, batches, announcements):
    from django.utils import timezone

    now = timezone.now()
    admin = users_by_username["sardor.yusupov"]
    manager = users_by_username["malika.abdullayeva"]
    supervisor = users_by_username["dilshod.rahimov"]
    operator = users_by_username["azizbek.karimov"]

    create_audit(AuditLog, admin, "manager_created", manager, manager.get_full_name(), now - timedelta(days=35))
    create_audit(AuditLog, manager, "supervisor_created", supervisor, supervisor.get_full_name(), now - timedelta(days=34))
    create_audit(AuditLog, supervisor, "operator_created", operator, operator.get_full_name(), now - timedelta(days=33))
    create_audit(AuditLog, manager, "operator_updated", operator, operator.get_full_name(), now - timedelta(days=30))

    for index, batch in enumerate(batches, start=1):
        create_audit(
            AuditLog,
            operator,
            "upload_created",
            batch,
            batch.original_filename,
            batch.created_at + timedelta(minutes=2),
            {
                "source_type": batch.source_type,
                "rows_in_file": batch.rows_in_file,
                "imported_count": batch.imported_count,
                "duplicate_count": batch.duplicate_count,
                "skipped_count": batch.skipped_count,
                "region": batch.assigned_region.name if batch.assigned_region else "",
                "branch": batch.assigned_branch.name if batch.assigned_branch else "",
                "order": index,
            },
        )

    for announcement in announcements:
        create_audit(
            AuditLog,
            announcement.created_by,
            "announcement_created",
            announcement,
            announcement.title,
            announcement.created_at + timedelta(minutes=3),
            {"target": announcement.target},
        )

    print(f"audit: {4 + len(batches) + len(announcements)} seed events created")


def seed_initial_data():
    from accounts.models import AuditLog, Branch, Region, User
    from records.models import Announcement, RegistryRecord, UploadBatch

    cleanup_seed_data(User, UploadBatch, RegistryRecord, Announcement, AuditLog)

    region = ensure_region(Region)
    branches = [ensure_branch(Branch, region, item) for item in BRANCHES]
    branches_by_name = {branch.name: branch for branch in branches}

    users = [ensure_user(User, region, branches_by_name, item) for item in INITIAL_USERS]
    users_by_username = {user.username: user for user in users}
    operator = users_by_username["azizbek.karimov"]

    batches = import_data_files(UploadBatch, RegistryRecord, operator, region, branches_by_name)
    announcements = seed_announcements(Announcement, region, users_by_username)
    seed_audit_logs(AuditLog, users_by_username, batches, announcements)

    print("")
    print("Test login/parollar:")
    for item, user in zip(INITIAL_USERS, users):
        location = user.branch.name if user.branch else user.region.name
        print(f"- {user.role}: {user.username} / {item['password']} / {location}")


def main():
    ensure_database()
    setup_django()
    run_migrations()
    seed_initial_data()


if __name__ == "__main__":
    main()
