from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from accounts.models import UserRole

User = get_user_model()


class Command(BaseCommand):
    help = 'Create a superuser with predefined credentials'

    def handle(self, *args, **kwargs):
        email = 'admin@edustream.com'
        password = 'admin123'
        
        if User.objects.filter(email=email).exists():
            self.stdout.write(self.style.WARNING(f'User {email} already exists'))
            return
        
        user = User.objects.create_superuser(
            email=email,
            username='admin',
            password=password,
            first_name='Admin',
            email_verified=True
        )
        
        # Create admin role
        UserRole.objects.create(user=user, role=UserRole.RoleChoices.ADMIN)
        
        self.stdout.write(self.style.SUCCESS(f'Successfully created superuser: {email}'))
        self.stdout.write(self.style.SUCCESS(f'Password: {password}'))
