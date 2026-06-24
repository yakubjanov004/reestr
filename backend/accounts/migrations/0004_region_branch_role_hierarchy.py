import django.db.models.deletion
from django.db import migrations, models


def forwards_roles(apps, schema_editor):
    User = apps.get_model("accounts", "User")
    User.objects.filter(is_superuser=True).update(role="admin")
    User.objects.filter(role="manager", is_superuser=False).update(role="supervisor")


def backwards_roles(apps, schema_editor):
    User = apps.get_model("accounts", "User")
    User.objects.filter(role__in=("supervisor", "admin")).update(role="manager")


class Migration(migrations.Migration):
    dependencies = [
        ("accounts", "0003_alter_user_managers"),
    ]

    operations = [
        migrations.CreateModel(
            name="Region",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("name", models.CharField(max_length=120, unique=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
            ],
            options={
                "ordering": ("name",),
            },
        ),
        migrations.CreateModel(
            name="Branch",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("name", models.CharField(max_length=160)),
                ("code", models.CharField(blank=True, max_length=50)),
                ("is_active", models.BooleanField(default=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                (
                    "region",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.PROTECT,
                        related_name="branches",
                        to="accounts.region",
                    ),
                ),
            ],
            options={
                "ordering": ("region__name", "name"),
            },
        ),
        migrations.AddField(
            model_name="user",
            name="branch",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="users",
                to="accounts.branch",
            ),
        ),
        migrations.AddField(
            model_name="user",
            name="region",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="users",
                to="accounts.region",
            ),
        ),
        migrations.AlterField(
            model_name="user",
            name="role",
            field=models.CharField(
                choices=[
                    ("operator", "Operator"),
                    ("supervisor", "Supervisor"),
                    ("manager", "Manager"),
                    ("admin", "Admin"),
                ],
                default="operator",
                max_length=20,
            ),
        ),
        migrations.AddConstraint(
            model_name="branch",
            constraint=models.UniqueConstraint(fields=("region", "name"), name="accounts_branch_region_name_uniq"),
        ),
        migrations.RunPython(forwards_roles, backwards_roles),
    ]
