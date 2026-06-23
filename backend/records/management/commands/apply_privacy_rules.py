from django.core.management.base import BaseCommand

from records.models import RegistryRecord
from records.services import build_dedupe_key, sanitize_record_instance


class Command(BaseCommand):
    help = "Mask yellow fields and clear red fields from existing registry records."

    def handle(self, *args, **options):
        updated = 0
        for record in RegistryRecord.objects.iterator():
            dedupe_source = {
                "contract_number": record.contract_number,
                "request_number": record.request_number,
                "phone_number": record.phone_number,
                "sim_card_number": record.sim_card_number,
                "internet_login": record.internet_login,
                "account_number": record.account_number,
                "document_number": record.document_number,
                "client_name": record.client_name,
                "connection_date": record.connection_date,
                "contract_date": record.contract_date,
            }
            record.dedupe_key = build_dedupe_key(record.source_type, dedupe_source)
            sanitize_record_instance(record)
            record.save()
            updated += 1

        self.stdout.write(self.style.SUCCESS(f"Privacy rules applied to {updated} records."))
