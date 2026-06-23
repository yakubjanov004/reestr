import accounts.models
from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("accounts", "0002_auditlog"),
    ]

    operations = [
        migrations.AlterModelManagers(
            name="user",
            managers=[
                ("objects", accounts.models.UserManager()),
            ],
        ),
    ]
