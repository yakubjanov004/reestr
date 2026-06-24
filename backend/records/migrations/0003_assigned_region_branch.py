import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("accounts", "0004_region_branch_role_hierarchy"),
        ("records", "0002_uploadbatch_import_errors"),
    ]

    operations = [
        migrations.AddField(
            model_name="uploadbatch",
            name="assigned_branch",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.PROTECT,
                related_name="upload_batches",
                to="accounts.branch",
            ),
        ),
        migrations.AddField(
            model_name="uploadbatch",
            name="assigned_region",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.PROTECT,
                related_name="upload_batches",
                to="accounts.region",
            ),
        ),
        migrations.AddField(
            model_name="registryrecord",
            name="assigned_branch",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.PROTECT,
                related_name="registry_records",
                to="accounts.branch",
            ),
        ),
        migrations.AddField(
            model_name="registryrecord",
            name="assigned_region",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.PROTECT,
                related_name="registry_records",
                to="accounts.region",
            ),
        ),
        migrations.AddIndex(
            model_name="registryrecord",
            index=models.Index(fields=["assigned_region", "created_at"], name="records_reg_region_72429c_idx"),
        ),
        migrations.AddIndex(
            model_name="registryrecord",
            index=models.Index(fields=["assigned_branch", "created_at"], name="records_reg_branch_c95de4_idx"),
        ),
    ]
