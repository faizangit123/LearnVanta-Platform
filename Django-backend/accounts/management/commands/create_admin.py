from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from accounts.models import UserRole
import os

User = get_user_model()

class Command(BaseCommand):
    help = "Create admin user if it does not exist"

    def handle(self, *args, **kwargs):
        email = os.getenv("ADMIN_EMAIL")
        username = os.getenv("ADMIN_USERNAME", "admin")
        password = os.getenv("ADMIN_PASSWORD")

        if not email or not password:
            self.stdout.write(self.style.WARNING("Admin credentials not set"))
            return

        if User.objects.filter(email=email).exists():
            self.stdout.write(self.style.WARNING("Admin user already exists"))
            return

        user = User.objects.create_superuser(
            email=email,
            username=username,
            password=password,
            first_name="Admin",
            email_verified=True
        )

        UserRole.objects.create(
            user=user,
            role=UserRole.RoleChoices.ADMIN
        )

        self.stdout.write(self.style.SUCCESS("Admin superuser created successfully"))
