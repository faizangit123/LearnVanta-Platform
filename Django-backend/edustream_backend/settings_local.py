# Local-only overrides (NOT used in Docker)

DEBUG = True

ALLOWED_HOSTS = ['localhost', '127.0.0.1']

# Example: local email testing
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
