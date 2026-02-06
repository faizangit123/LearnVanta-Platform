from django.db import models


class Class(models.Model):
    """Educational class/grade level"""
    id = models.CharField(primary_key=True, max_length=50)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, default='book')
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = 'classes'
        ordering = ['order']
        verbose_name_plural = 'Classes'

    def __str__(self):
        return self.name


class Subject(models.Model):
    """Subject within a class"""
    id = models.CharField(primary_key=True, max_length=50)
    class_ref = models.ForeignKey(
        Class, on_delete=models.CASCADE, related_name='subjects', db_column='class_id'
    )
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, default='book')
    color = models.CharField(max_length=50, default='blue')
    chapter_count = models.IntegerField(default=0)
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    is_primary = models.BooleanField(default=False, null=True)
    _dummy_migration_trigger = models.BooleanField(default=False)
    class Meta:
        db_table = 'subjects'
        ordering = ['order']

    def __str__(self):
        return f"{self.name} ({self.class_ref.name})"


class Chapter(models.Model):
    """Chapter within a subject"""
    id = models.CharField(primary_key=True, max_length=50)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name='chapters')
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    video_count = models.IntegerField(default=0)
    duration = models.CharField(max_length=20, blank=True)
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = 'chapters'
        ordering = ['order']

    def __str__(self):
        return f"{self.name} - {self.subject.name}"


class Video(models.Model):
    """Video lesson"""
    class VideoType(models.TextChoices):
        YOUTUBE = 'youtube', 'YouTube'
        VIMEO = 'vimeo', 'Vimeo'
        DIRECT = 'direct', 'Direct URL'

    id = models.CharField(primary_key=True, max_length=50)
    chapter = models.ForeignKey(Chapter, on_delete=models.CASCADE, related_name='videos')

    title = models.CharField(max_length=300)
    description = models.TextField(blank=True)

    video_type = models.CharField(
        max_length=20,
        choices=VideoType.choices,
        default=VideoType.YOUTUBE
    )

    youtube_id = models.CharField(max_length=50, blank=True)
    youtube_url = models.URLField(blank=True)
    video_url = models.URLField(blank=True)
    thumbnail = models.URLField(blank=True)

    duration = models.CharField(max_length=20)

    views = models.IntegerField(default=0)
    likes = models.IntegerField(default=0)
    tags = models.JSONField(default=list)

    is_trending = models.BooleanField(default=False)
    is_recent = models.BooleanField(default=True)
    is_active = models.BooleanField(default=True)

    published_at = models.DateTimeField(auto_now_add=True)
    order = models.IntegerField(default=0)

    class Meta:
        db_table = 'videos'
        ordering = ['order', '-published_at']

    def __str__(self):
        return self.title


class Playlist(models.Model):
    """Admin-managed playlist"""
    id = models.CharField(primary_key=True, max_length=50)
    chapter = models.ForeignKey(
        Chapter, on_delete=models.CASCADE, related_name='playlists', null=True, blank=True
    )
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    thumbnail = models.URLField(blank=True)
    is_public = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    class Meta:
        db_table = 'playlists'

    def __str__(self):
        return self.title


class PlaylistVideo(models.Model):
    """Videos in a playlist with ordering"""
    playlist = models.ForeignKey(Playlist, on_delete=models.CASCADE, related_name='playlist_videos')
    video = models.ForeignKey(Video, on_delete=models.CASCADE)
    order = models.IntegerField(default=0)

    class Meta:
        db_table = 'playlist_videos'
        ordering = ['order']
        unique_together = ['playlist', 'video']
