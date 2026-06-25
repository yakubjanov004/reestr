import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("accounts", "0004_region_branch_role_hierarchy"),
        ("records", "0003_assigned_region_branch"),
    ]

    operations = [
        migrations.CreateModel(
            name="Announcement",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("title", models.CharField(max_length=180)),
                ("body", models.TextField()),
                (
                    "target",
                    models.CharField(
                        choices=[
                            ("all", "All users"),
                            ("supervisor", "Supervisors"),
                            ("operator", "Operators"),
                        ],
                        default="all",
                        max_length=20,
                    ),
                ),
                ("is_active", models.BooleanField(default=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "assigned_branch",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.PROTECT,
                        related_name="announcements",
                        to="accounts.branch",
                    ),
                ),
                (
                    "assigned_region",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.PROTECT,
                        related_name="announcements",
                        to="accounts.region",
                    ),
                ),
                (
                    "created_by",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.PROTECT,
                        related_name="announcements",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "ordering": ("-created_at", "-id"),
            },
        ),
        migrations.AddIndex(
            model_name="announcement",
            index=models.Index(fields=["target", "created_at"], name="records_ann_target_8b2b70_idx"),
        ),
        migrations.AddIndex(
            model_name="announcement",
            index=models.Index(fields=["assigned_region", "created_at"], name="records_ann_region_3c5b62_idx"),
        ),
        migrations.AddIndex(
            model_name="announcement",
            index=models.Index(fields=["assigned_branch", "created_at"], name="records_ann_branch_5e6f4a_idx"),
        ),
    ]
