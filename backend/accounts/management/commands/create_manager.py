import os

from django.core.management.base import BaseCommand, CommandError

from accounts.models import Region, User


class Command(BaseCommand):
    help = "Create or update the initial supervisor from .env values."

    def handle(self, *args, **options):
        username = os.getenv("MANAGER_USERNAME")
        password = os.getenv("MANAGER_PASSWORD")
        if not username or not password:
            raise CommandError("MANAGER_USERNAME and MANAGER_PASSWORD must be set in .env")

        user, created = User.objects.get_or_create(
            username=username,
            defaults={
                "email": os.getenv("MANAGER_EMAIL", ""),
                "first_name": os.getenv("MANAGER_FIRST_NAME", ""),
                "last_name": os.getenv("MANAGER_LAST_NAME", ""),
                "role": User.Role.SUPERVISOR,
                "is_staff": True,
            },
        )
        user.role = User.Role.SUPERVISOR
        user.is_staff = True
        user.email = os.getenv("MANAGER_EMAIL", user.email)
        user.first_name = os.getenv("MANAGER_FIRST_NAME", user.first_name)
        user.last_name = os.getenv("MANAGER_LAST_NAME", user.last_name)
        region_name = os.getenv("SUPERVISOR_REGION_NAME") or os.getenv("MANAGER_REGION_NAME")
        if region_name:
            region, _ = Region.objects.get_or_create(name=region_name.strip())
            user.region = region
        user.set_password(password)
        user.save()

        action = "created" if created else "updated"
        self.stdout.write(self.style.SUCCESS(f"Supervisor {username!r} {action}."))
