# EduStream Django Backend Integration Guide

This document provides complete specifications for building the Django REST API backend to integrate with the EduStream React frontend.

## Table of Contents
1. [Overview](#overview)
2. [Technology Stack](#technology-stack)
3. [Project Setup](#project-setup)
4. [Database Models](#database-models)
5. [API Endpoints](#api-endpoints)
6. [Authentication](#authentication)
7. [CORS Configuration](#cors-configuration)
8. [File Storage](#file-storage)
9. [Environment Variables](#environment-variables)
10. [Deployment](#deployment)

---

## Overview

The EduStream frontend is a video learning platform that requires the following backend capabilities:
- User authentication with email verification
- Role-based access control (Admin, User)
- Video content management (Classes → Subjects → Chapters → Videos)
- User features: Watch History, Favorites, Notes, Playlists
- Resource management (PDF downloads for chapters)
- Activity logging for admin dashboard

**Frontend Toggle**: The frontend has a `useMock` flag in `src/config/api.js`. Set `VITE_USE_MOCK=false` in your environment to connect to this Django backend.

---

## Technology Stack

### Required
- Python 3.10+
- Django 4.2+
- Django REST Framework 3.14+
- PostgreSQL 14+ (recommended) or SQLite for development

### Recommended Packages
```
django>=4.2
djangorestframework>=3.14
django-cors-headers>=4.0
djangorestframework-simplejwt>=5.3  # For JWT auth (alternative: Token auth)
django-filter>=23.0
Pillow>=10.0  # For image handling
python-decouple>=3.8  # For environment variables
gunicorn>=21.0  # Production server
whitenoise>=6.5  # Static files
boto3>=1.28  # For S3 storage (optional)
```

---

## Project Setup

### 1. Create Django Project
```bash
django-admin startproject edustream_backend
cd edustream_backend

# Create apps
python manage.py startapp accounts    # User auth & profiles
python manage.py startapp content     # Classes, Subjects, Chapters, Videos
python manage.py startapp userdata    # History, Favorites, Notes, Playlists
python manage.py startapp resources   # PDF resources
python manage.py startapp activities  # Activity logging
```

### 2. Settings Configuration
```python
# settings.py

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # Third party
    'rest_framework',
    'rest_framework.authtoken',  # For Token auth
    'corsheaders',
    'django_filters',
    
    # Local apps
    'accounts',
    'content',
    'userdata',
    'resources',
    'activities',
]

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
        # Or for JWT: 'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
    'DEFAULT_FILTER_BACKENDS': [
        'django_filters.rest_framework.DjangoFilterBackend',
        'rest_framework.filters.SearchFilter',
        'rest_framework.filters.OrderingFilter',
    ],
}

AUTH_USER_MODEL = 'accounts.User'
```

---

## Database Models

### Accounts App (`accounts/models.py`)

```python
from django.contrib.auth.models import AbstractUser
from django.db import models
import uuid

class User(AbstractUser):
    """Extended User model"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    email_verified = models.BooleanField(default=False)
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    class Meta:
        db_table = 'users'


class UserRole(models.Model):
    """
    IMPORTANT: Roles are stored in a separate table for security.
    Never store roles on the User model directly to prevent privilege escalation.
    """
    class RoleChoices(models.TextChoices):
        ADMIN = 'admin', 'Admin'
        USER = 'user', 'User'
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='roles')
    role = models.CharField(max_length=20, choices=RoleChoices.choices, default=RoleChoices.USER)
    granted_at = models.DateTimeField(auto_now_add=True)
    granted_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='granted_roles')
    
    class Meta:
        db_table = 'user_roles'
        unique_together = ['user', 'role']


class EmailVerificationToken(models.Model):
    """Token for email verification"""
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    token = models.CharField(max_length=255, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    used = models.BooleanField(default=False)
    
    class Meta:
        db_table = 'email_verification_tokens'


class PasswordResetToken(models.Model):
    """Token for password reset"""
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    token = models.CharField(max_length=255, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    used = models.BooleanField(default=False)
    
    class Meta:
        db_table = 'password_reset_tokens'
```

### Content App (`content/models.py`)

```python
from django.db import models
import uuid

class Class(models.Model):
    """Educational class/grade level"""
    id = models.CharField(primary_key=True, max_length=50)  # e.g., 'class-11', 'class-12'
    name = models.CharField(max_length=100)  # e.g., 'Class 11', 'Class 12'
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, default='book')  # Lucide icon name
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'classes'
        ordering = ['order']
        verbose_name_plural = 'Classes'


class Subject(models.Model):
    """Subject within a class"""
    id = models.CharField(primary_key=True, max_length=50)  # e.g., 'physics-11'
    class_ref = models.ForeignKey(Class, on_delete=models.CASCADE, related_name='subjects', db_column='class_id')
    name = models.CharField(max_length=100)  # e.g., 'Physics'
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, default='book')
    color = models.CharField(max_length=50, default='blue')  # For UI theming
    chapter_count = models.IntegerField(default=0)
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'subjects'
        ordering = ['order']


class Chapter(models.Model):
    """Chapter within a subject"""
    id = models.CharField(primary_key=True, max_length=50)  # e.g., 'ch-1-physics-11'
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name='chapters')
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    video_count = models.IntegerField(default=0)
    duration = models.CharField(max_length=20, blank=True)  # Total duration
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'chapters'
        ordering = ['order']


class Video(models.Model):
    """Video lesson"""
    class VideoType(models.TextChoices):
        YOUTUBE = 'youtube', 'YouTube'
        VIMEO = 'vimeo', 'Vimeo'
        DIRECT = 'direct', 'Direct URL'
    
    id = models.CharField(primary_key=True, max_length=50)  # e.g., 'vid-123'
    chapter = models.ForeignKey(Chapter, on_delete=models.CASCADE, related_name='videos')
    title = models.CharField(max_length=300)
    description = models.TextField(blank=True)
    video_type = models.CharField(max_length=20, choices=VideoType.choices, default=VideoType.YOUTUBE)
    youtube_id = models.CharField(max_length=50, blank=True)
    youtube_url = models.URLField(blank=True)
    video_url = models.URLField(blank=True)  # For direct/vimeo
    thumbnail = models.URLField(blank=True)
    duration = models.CharField(max_length=20)  # e.g., '15:30'
    views = models.IntegerField(default=0)
    likes = models.IntegerField(default=0)
    tags = models.JSONField(default=list)  # ['algebra', 'quadratic']
    is_trending = models.BooleanField(default=False)
    is_recent = models.BooleanField(default=True)
    published_at = models.DateField(auto_now_add=True)
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'videos'
        ordering = ['order', '-published_at']


class Playlist(models.Model):
    """Admin-managed playlist (for chapter organization)"""
    id = models.CharField(primary_key=True, max_length=50)
    chapter = models.ForeignKey(Chapter, on_delete=models.CASCADE, related_name='playlists', null=True, blank=True)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    thumbnail = models.URLField(blank=True)
    is_public = models.BooleanField(default=True)
    created_at = models.DateField(auto_now_add=True)
    
    class Meta:
        db_table = 'playlists'


class PlaylistVideo(models.Model):
    """Videos in a playlist with ordering"""
    playlist = models.ForeignKey(Playlist, on_delete=models.CASCADE, related_name='playlist_videos')
    video = models.ForeignKey(Video, on_delete=models.CASCADE)
    order = models.IntegerField(default=0)
    
    class Meta:
        db_table = 'playlist_videos'
        ordering = ['order']
        unique_together = ['playlist', 'video']
```

### UserData App (`userdata/models.py`)

```python
from django.db import models
from django.conf import settings
import uuid

class WatchHistory(models.Model):
    """User's watch history"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='watch_history')
    video = models.ForeignKey('content.Video', on_delete=models.CASCADE)
    watched_at = models.DateTimeField(auto_now=True)
    progress_percentage = models.IntegerField(default=0)  # 0-100
    
    class Meta:
        db_table = 'watch_history'
        ordering = ['-watched_at']
        unique_together = ['user', 'video']


class WatchProgress(models.Model):
    """Video watch progress for resume functionality"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='watch_progress')
    video = models.ForeignKey('content.Video', on_delete=models.CASCADE)
    current_time = models.FloatField(default=0)  # Seconds
    duration = models.FloatField(default=0)  # Total duration in seconds
    percentage = models.IntegerField(default=0)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'watch_progress'
        unique_together = ['user', 'video']


class Favorite(models.Model):
    """User's favorite videos"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='favorites')
    video = models.ForeignKey('content.Video', on_delete=models.CASCADE)
    added_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'favorites'
        ordering = ['-added_at']
        unique_together = ['user', 'video']


class Note(models.Model):
    """User notes on videos"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notes')
    video = models.ForeignKey('content.Video', on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.FloatField(null=True, blank=True)  # Video timestamp in seconds
    is_pinned = models.BooleanField(default=False)
    is_archived = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'notes'
        ordering = ['-created_at']


class UserPlaylist(models.Model):
    """User-created playlists"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='user_playlists')
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'user_playlists'
        ordering = ['-created_at']


class UserPlaylistVideo(models.Model):
    """Videos in user playlists"""
    playlist = models.ForeignKey(UserPlaylist, on_delete=models.CASCADE, related_name='playlist_videos')
    video = models.ForeignKey('content.Video', on_delete=models.CASCADE)
    order = models.IntegerField(default=0)
    added_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'user_playlist_videos'
        ordering = ['order']
        unique_together = ['playlist', 'video']
```

### Resources App (`resources/models.py`)

```python
from django.db import models
import uuid

class Resource(models.Model):
    """Chapter resources (PDFs)"""
    class ResourceType(models.TextChoices):
        NOTES = 'notes', 'Chapter Notes'
        PRACTICE = 'practice', 'Practice Questions'
        FORMULAS = 'formulas', 'Formula Sheet'
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    chapter = models.ForeignKey('content.Chapter', on_delete=models.CASCADE, related_name='resources')
    type = models.CharField(max_length=20, choices=ResourceType.choices)
    title = models.CharField(max_length=200)
    file = models.FileField(upload_to='resources/')
    file_name = models.CharField(max_length=255)
    file_size = models.IntegerField()  # In bytes
    mime_type = models.CharField(max_length=100, default='application/pdf')
    download_count = models.IntegerField(default=0)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    uploaded_by = models.ForeignKey('accounts.User', on_delete=models.SET_NULL, null=True)
    
    class Meta:
        db_table = 'resources'
        unique_together = ['chapter', 'type']  # One of each type per chapter
```

### Activities App (`activities/models.py`)

```python
from django.db import models
from django.conf import settings
import uuid

class ActivityLog(models.Model):
    """Activity log for admin dashboard"""
    class ActivityType(models.TextChoices):
        USER_REGISTERED = 'user_registered', 'User Registered'
        USER_LOGIN = 'user_login', 'User Login'
        ROLE_CHANGED = 'role_changed', 'Role Changed'
        USER_DELETED = 'user_deleted', 'User Deleted'
        VIDEO_CREATED = 'video_created', 'Video Created'
        VIDEO_UPDATED = 'video_updated', 'Video Updated'
        VIDEO_DELETED = 'video_deleted', 'Video Deleted'
        PROFILE_UPDATED = 'profile_updated', 'Profile Updated'
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    type = models.CharField(max_length=50, choices=ActivityType.choices)
    details = models.JSONField(default=dict)  # Flexible metadata
    timestamp = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'activity_logs'
        ordering = ['-timestamp']
```

---

## API Endpoints

All endpoints should be prefixed with `/api/v1/`

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/login/` | Login with email/password | No |
| POST | `/auth/register/` | Register new user | No |
| POST | `/auth/logout/` | Logout (invalidate token) | Yes |
| GET | `/auth/profile/` | Get current user profile | Yes |
| PATCH | `/auth/profile/` | Update profile (name, avatar) | Yes |
| POST | `/auth/verify-email/` | Verify email with token | No |
| POST | `/auth/resend-verification/` | Resend verification email | No |
| POST | `/auth/password-reset/` | Request password reset | No |
| POST | `/auth/password-reset/confirm/` | Reset password with token | No |
| POST | `/auth/token/refresh/` | Refresh auth token (JWT) | No |

### User Management (Admin Only)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/users/` | List all users |
| GET | `/admin/users/{id}/` | Get user details |
| PATCH | `/admin/users/{id}/role/` | Update user role |
| DELETE | `/admin/users/{id}/` | Delete user |

### Content Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/classes/` | List all classes | No |
| GET | `/classes/{id}/` | Get class details | No |
| GET | `/classes/{id}/subjects/` | Get subjects for class | No |
| GET | `/subjects/` | List all subjects | No |
| GET | `/subjects/{id}/` | Get subject details | No |
| GET | `/subjects/{id}/chapters/` | Get chapters for subject | No |
| GET | `/chapters/` | List all chapters | No |
| GET | `/chapters/{id}/` | Get chapter details | No |
| GET | `/chapters/{id}/videos/` | Get videos for chapter | No |
| GET | `/videos/` | List all videos (paginated) | No |
| GET | `/videos/{id}/` | Get video details | No |
| GET | `/videos/search/?q={query}` | Search videos | No |
| GET | `/videos/trending/` | Get trending videos | No |
| GET | `/videos/recent/` | Get recent videos | No |

### Video Management (Admin Only)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/videos/` | Create video |
| PATCH | `/videos/{id}/` | Update video |
| DELETE | `/videos/{id}/` | Delete video |
| POST | `/videos/bulk-delete/` | Bulk delete videos |
| POST | `/videos/bulk-update/` | Bulk update videos |

### Playlist Endpoints (Admin)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/playlists/` | List all playlists |
| POST | `/playlists/` | Create playlist |
| GET | `/playlists/{id}/` | Get playlist details |
| PATCH | `/playlists/{id}/` | Update playlist |
| DELETE | `/playlists/{id}/` | Delete playlist |
| POST | `/playlists/{id}/add-video/` | Add video to playlist |
| POST | `/playlists/{id}/remove-video/` | Remove video from playlist |
| POST | `/playlists/{id}/reorder/` | Reorder playlist videos |

### User Data Endpoints (Authenticated Users)

#### Watch History
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/user/history/` | Get watch history |
| POST | `/user/history/` | Add to history |
| DELETE | `/user/history/{videoId}/` | Remove from history |
| POST | `/user/history/clear/` | Clear all history |

#### Watch Progress
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/user/progress/{videoId}/` | Get video progress |
| POST | `/user/progress/{videoId}/` | Update video progress |

#### Favorites
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/user/favorites/` | Get favorites |
| POST | `/user/favorites/` | Add to favorites |
| DELETE | `/user/favorites/{videoId}/` | Remove from favorites |
| POST | `/user/favorites/{videoId}/toggle/` | Toggle favorite |
| GET | `/user/favorites/{videoId}/check/` | Check if favorited |

#### Notes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/user/notes/` | Get all user notes |
| GET | `/user/notes/video/{videoId}/` | Get notes for video |
| POST | `/user/notes/` | Create note |
| PATCH | `/user/notes/{id}/` | Update note |
| DELETE | `/user/notes/{id}/` | Delete note |

#### User Playlists
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/user/playlists/` | Get user's playlists |
| POST | `/user/playlists/` | Create playlist |
| GET | `/user/playlists/{id}/` | Get playlist details |
| PATCH | `/user/playlists/{id}/` | Update playlist |
| DELETE | `/user/playlists/{id}/` | Delete playlist |
| POST | `/user/playlists/{id}/add-video/` | Add video |
| POST | `/user/playlists/{id}/remove-video/` | Remove video |
| POST | `/user/playlists/{id}/reorder/` | Reorder videos |

### Resources Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/resources/` | List all resources | Admin |
| GET | `/chapters/{id}/resources/` | Get chapter resources | No |
| POST | `/resources/` | Upload resource | Admin |
| DELETE | `/resources/{id}/` | Delete resource | Admin |
| GET | `/resources/{id}/download/` | Get download URL | Yes |
| POST | `/resources/{id}/track-download/` | Track download | Yes |

### Activity Logs (Admin Only)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/activities/` | List activities (paginated) |
| GET | `/admin/activities/recent/?limit=20` | Get recent activities |
| GET | `/admin/activities/stats/` | Get activity statistics |
| POST | `/admin/activities/clear/` | Clear all logs |

---

## Authentication

### Option 1: Token Authentication (Simpler)

```python
# settings.py
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
    ],
}

# Login Response
{
    "token": "9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b",
    "user": {
        "id": "uuid",
        "email": "user@example.com",
        "name": "User Name",
        "role": "user",
        "email_verified": true
    }
}
```

### Option 2: JWT Authentication (More Secure)

```python
# settings.py
from datetime import timedelta

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
}

# Login Response
{
    "access": "eyJ0eXAiOiJKV1QiLC...",
    "refresh": "eyJ0eXAiOiJKV1QiLC...",
    "user": {
        "id": "uuid",
        "email": "user@example.com",
        "name": "User Name",
        "role": "user"
    }
}
```

### Role Checking Utility

```python
# accounts/utils.py
from accounts.models import UserRole

def has_role(user, role):
    """Check if user has a specific role"""
    return UserRole.objects.filter(user=user, role=role).exists()

def is_admin(user):
    """Check if user is admin"""
    return has_role(user, UserRole.RoleChoices.ADMIN)

# permissions.py
from rest_framework.permissions import BasePermission

class IsAdmin(BasePermission):
    """Permission check for admin users"""
    def has_permission(self, request, view):
        return request.user.is_authenticated and is_admin(request.user)
```

---

## CORS Configuration

```python
# settings.py

INSTALLED_APPS = [
    ...
    'corsheaders',
    ...
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # Must be at top
    'django.middleware.common.CommonMiddleware',
    ...
]

# Development
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",  # Vite dev server
    "http://localhost:3000",
    "http://127.0.0.1:5173",
]

# Or allow all in development (not recommended for production)
# CORS_ALLOW_ALL_ORIGINS = True

# Production - set your actual frontend URL
# CORS_ALLOWED_ORIGINS = [
#     "https://edustream.yourapp.com",
# ]

CORS_ALLOW_CREDENTIALS = True

CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]
```

---

## File Storage

### Local Storage (Development)
```python
# settings.py
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'
```

### AWS S3 (Production)
```python
# settings.py
DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'

AWS_ACCESS_KEY_ID = os.environ.get('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.environ.get('AWS_SECRET_ACCESS_KEY')
AWS_STORAGE_BUCKET_NAME = os.environ.get('AWS_STORAGE_BUCKET_NAME')
AWS_S3_REGION_NAME = 'us-east-1'
AWS_DEFAULT_ACL = 'private'
AWS_S3_FILE_OVERWRITE = False
AWS_QUERYSTRING_EXPIRE = 3600  # Signed URL expiration (1 hour)
```

---

## Environment Variables

Create a `.env` file:

```env
# Django
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DATABASE_URL=postgres://user:password@localhost:5432/edustream

# Email (for verification)
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password

# Frontend URL (for email links)
FRONTEND_URL=http://localhost:5173

# AWS S3 (optional)
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_STORAGE_BUCKET_NAME=edustream-bucket
```

---

## Deployment

### Docker Setup

```dockerfile
# Dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN python manage.py collectstatic --noinput

EXPOSE 8000

CMD ["gunicorn", "--bind", "0.0.0.0:8000", "edustream_backend.wsgi:application"]
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgres://postgres:postgres@db:5432/edustream
    depends_on:
      - db
    
  db:
    image: postgres:14
    environment:
      - POSTGRES_DB=edustream
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### Production Checklist

1. ✅ Set `DEBUG=False`
2. ✅ Configure `ALLOWED_HOSTS`
3. ✅ Use PostgreSQL instead of SQLite
4. ✅ Set up HTTPS
5. ✅ Configure proper CORS origins
6. ✅ Use environment variables for secrets
7. ✅ Set up static file serving (whitenoise/nginx)
8. ✅ Configure email backend for production
9. ✅ Set up file storage (S3 or similar)
10. ✅ Add rate limiting for API endpoints

---

## Frontend Integration Steps

1. **Set Environment Variables**:
   ```env
   VITE_API_BASE_URL=http://localhost:8000
   VITE_USE_MOCK=false
   ```

2. **Test Connection**:
   - Start Django server: `python manage.py runserver`
   - Start frontend: `npm run dev`
   - Check network tab for API calls

3. **Seed Data**:
   Create a management command to seed initial data:
   ```bash
   python manage.py seed_data
   ```

---

## API Response Formats

### Success Response
```json
{
    "id": "uuid",
    "field": "value",
    ...
}
```

### Error Response
```json
{
    "detail": "Error message here",
    "code": "error_code"  // optional
}
```

### Paginated Response
```json
{
    "count": 100,
    "next": "http://api/videos/?page=2",
    "previous": null,
    "results": [...]
}
```

---

## Questions?

If you need help implementing any of these features, the frontend code in `src/services/` and `src/hooks/` provides the exact API contract expected by each feature.

Key files to reference:
- `src/config/api.js` - API endpoints and configuration
- `src/services/authService.js` - Auth flow
- `src/services/videoService.js` - Video/user data operations
- `src/context/AuthContext.jsx` - Auth state management
