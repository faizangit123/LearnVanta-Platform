from django.db import models
from django.conf import settings
import uuid


class WatchHistory(models.Model):
    """User's watch history"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='watch_history'
    )
    video = models.ForeignKey('content.Video', on_delete=models.CASCADE)
    watched_at = models.DateTimeField(auto_now=True)
    progress_percentage = models.IntegerField(default=0)

    class Meta:
        db_table = 'watch_history'
        ordering = ['-watched_at']
        unique_together = ['user', 'video']

    def __str__(self):
        return f"{self.user.email} - {self.video.title}"


class WatchProgress(models.Model):
    """Video watch progress for resume functionality"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='watch_progress'
    )
    video = models.ForeignKey('content.Video', on_delete=models.CASCADE)
    current_time = models.FloatField(default=0)
    duration = models.FloatField(default=0)
    percentage = models.IntegerField(default=0)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'watch_progress'
        unique_together = ['user', 'video']


class Favorite(models.Model):
    """User's favorite videos"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='favorites'
    )
    video = models.ForeignKey('content.Video', on_delete=models.CASCADE)
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'favorites'
        ordering = ['-added_at']
        unique_together = ['user', 'video']


class Note(models.Model):
    """User notes on videos"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notes'
    )
    video = models.ForeignKey('content.Video', on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.FloatField(null=True, blank=True)
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
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='user_playlists'
    )
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
