from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("records", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="uploadbatch",
            name="import_errors",
            field=models.JSONField(blank=True, default=list),
        ),
    ]
