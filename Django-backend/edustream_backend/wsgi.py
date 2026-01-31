"""
WSGI config for edustream_backend project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.2/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'edustream_backend.settings')

application = get_wsgi_application()

if os.environ.get("RENDER"):
    try:
        from django.core.management import call_command
        call_command("seed_data")
    except Exception as e:
        print("Seed error:", e)
