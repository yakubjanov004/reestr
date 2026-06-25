import os
import sys
import random
import uuid
from datetime import timedelta
from django.utils import timezone

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "telecom_registry.settings")
import django
django.setup()

from records.models import RegistryRecord, UploadBatch
from accounts.models import User, Region, Branch

def generate():
    operator = User.objects.filter(role="operator").first()
    region = Region.objects.first()
    branch = Branch.objects.first()
    if not operator or not region or not branch:
        print("Required models missing.")
        return

    print("Generating massive data...")
    batch = UploadBatch.objects.create(
        original_filename="massive_mock_data.xlsx",
        source_type="mobile",
        rows_in_file=10000,
        imported_count=10000,
        duplicate_count=0,
        skipped_count=0,
        uploaded_by=operator,
        assigned_region=region,
        assigned_branch=branch,
    )

    records = []
    now = timezone.now()
    names = ["Ali", "Vali", "Hasan", "Husan", "Gulnoza", "Dilnoza"]
    
    for i in range(10000):
        date_offset = random.randint(0, 100)
        rec_date = now - timedelta(days=date_offset)
        records.append(RegistryRecord(
            upload_batch=batch,
            uploaded_by=operator,
            assigned_region=region,
            assigned_branch=branch,
            source_type=random.choice(["mobile", "internet"]),
            dedupe_key=str(uuid.uuid4()),
            phone_number=f"+9989{random.randint(1000000, 9999999)}",
            client_name=f"{random.choice(names)} {random.choice(names)}ov",
            payment_amount=random.randint(10, 100) * 1000,
            status=random.choice(["active", "inactive", "pending"]),
            connection_date=rec_date,
        ))
    
    RegistryRecord.objects.bulk_create(records, batch_size=1000)
    
    print("Done! Added 10000 records.")

if __name__ == "__main__":
    generate()
