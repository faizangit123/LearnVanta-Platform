from django.db import models
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
    details = models.JSONField(default=dict)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'activity_logs'
        ordering = ['-timestamp']

    def __str__(self):
        return f"{self.type} - {self.timestamp}"
