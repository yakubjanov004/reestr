import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("accounts", "0004_region_branch_role_hierarchy"),
    ]

    operations = [
        migrations.AddField(
            model_name="user",
            name="phone_number",
            field=models.CharField(blank=True, max_length=32, null=True, unique=True),
        ),
        migrations.CreateModel(
            name="LoginSmsChallenge",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("phone_number", models.CharField(max_length=32)),
                ("challenge_token", models.CharField(max_length=96, unique=True)),
                ("code_hash", models.CharField(max_length=128)),
                ("delivery_channel", models.CharField(choices=[("mock", "Mock"), ("sms", "SMS")], default="mock", max_length=12)),
                ("attempts", models.PositiveSmallIntegerField(default=0)),
                ("max_attempts", models.PositiveSmallIntegerField(default=5)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("expires_at", models.DateTimeField()),
                ("verified_at", models.DateTimeField(blank=True, null=True)),
                ("user", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="login_sms_challenges", to="accounts.user")),
            ],
            options={
                "ordering": ("-created_at", "-id"),
            },
        ),
        migrations.CreateModel(
            name="LoginTrustedDevice",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("token_hash", models.CharField(max_length=128, unique=True)),
                ("user_agent", models.CharField(blank=True, max_length=255)),
                ("last_ip", models.CharField(blank=True, max_length=64)),
                ("is_active", models.BooleanField(default=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("last_used_at", models.DateTimeField(auto_now_add=True)),
                ("expires_at", models.DateTimeField()),
                ("user", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="login_trusted_devices", to="accounts.user")),
            ],
            options={
                "ordering": ("-last_used_at", "-id"),
            },
        ),
        migrations.AddIndex(
            model_name="loginsmschallenge",
            index=models.Index(fields=["user", "created_at"], name="accounts_sms_user_created_idx"),
        ),
        migrations.AddIndex(
            model_name="loginsmschallenge",
            index=models.Index(fields=["expires_at"], name="accounts_sms_expires_idx"),
        ),
        migrations.AddIndex(
            model_name="logintrusteddevice",
            index=models.Index(fields=["user", "expires_at"], name="accounts_trusted_user_exp_idx"),
        ),
        migrations.AddIndex(
            model_name="logintrusteddevice",
            index=models.Index(fields=["expires_at"], name="accounts_trusted_exp_idx"),
        ),
    ]
