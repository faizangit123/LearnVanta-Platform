from rest_framework import serializers
from .models import (
    WatchHistory,
    WatchProgress,
    Favorite,
    Note,
    UserPlaylist,
    UserPlaylistVideo
)
from content.serializers import VideoSerializer
from django.contrib.auth import get_user_model
from content.models import Video

User = get_user_model()


# --------------------------------
# BASIC USER (for relations)
# --------------------------------

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "username",
            "is_staff",
            "is_superuser",
        ]


# --------------------------------
# WATCH HISTORY
# --------------------------------

class WatchHistorySerializer(serializers.ModelSerializer):
    video_id = serializers.CharField(source='video.id', read_only=True)
    title = serializers.CharField(source='video.title', read_only=True)
    thumbnail = serializers.CharField(source='video.thumbnail', read_only=True)
    duration = serializers.FloatField(source='video.duration', read_only=True)
    chapter_name = serializers.CharField(source='video.chapter.name', read_only=True)
    progress = serializers.IntegerField(source='progress_percentage', read_only=True)

    class Meta:
        model = WatchHistory
        fields = [
            'video_id',
            'title',
            'thumbnail',
            'duration',
            'chapter_name',
            'progress',
            'watched_at'
        ]
        read_only_fields = fields


# --------------------------------
# WATCH PROGRESS
# --------------------------------

class WatchProgressSerializer(serializers.ModelSerializer):
    currentTime = serializers.IntegerField(source="current_time")

    class Meta:
        model = WatchProgress
        fields = [
            'currentTime',
            'duration',
            'percentage',
            'updated_at'
        ]
        read_only_fields = fields


# --------------------------------
# FAVORITES
# --------------------------------

class FavoriteSerializer(serializers.ModelSerializer):
    video_id = serializers.IntegerField(source='video.id', read_only=True)
    title = serializers.CharField(source='video.title', read_only=True)
    thumbnail = serializers.CharField(source='video.thumbnail', read_only=True)
    duration = serializers.FloatField(source='video.duration', read_only=True)
    chapter_name = serializers.CharField(source='video.chapter.name', read_only=True)

    class Meta:
        model = Favorite
        fields = [
            'video_id',
            'title',
            'thumbnail',
            'duration',
            'chapter_name',
            'added_at'
        ]
        read_only_fields = fields


# --------------------------------
# NOTES
# --------------------------------

class NoteSerializer(serializers.ModelSerializer):
    video = serializers.PrimaryKeyRelatedField(
        queryset=Video.objects.all(), required=False)
    chapter = serializers.SerializerMethodField()
    subject = serializers.SerializerMethodField()

    isPinned = serializers.BooleanField(source="is_pinned")
    isArchived = serializers.BooleanField(source="is_archived")
    createdAt = serializers.DateTimeField(source="created_at")
    updatedAt = serializers.DateTimeField(source="updated_at")

    class Meta:
        model = Note
        fields = [
            'id',
            'content',
            'timestamp',
            'isPinned',
            'isArchived',
            'createdAt',
            'updatedAt',
            'video',
            'chapter',
            'subject'
        ]

    def get_chapter(self, obj):
        from content.serializers import ChapterSerializer
        return ChapterSerializer(obj.video.chapter).data

    def get_subject(self, obj):
        from content.serializers import SubjectSerializer
        return SubjectSerializer(obj.video.chapter.subject).data
    


# --------------------------------
# USER PLAYLISTS (CORRECT MODEL)
# --------------------------------

class UserPlaylistSerializer(serializers.ModelSerializer):
    video_ids = serializers.SerializerMethodField()
    video_count = serializers.SerializerMethodField()

    class Meta:
        model = UserPlaylist
        fields = [
            'id',
            'name',
            'description',
            'video_ids',
            'video_count',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_video_ids(self, obj):
        return list(
            obj.playlist_videos
               .order_by("order")
               .values_list("video_id", flat=True)
        )

    def get_video_count(self, obj):
        return obj.playlist_videos.count()


# --------------------------------
# PLAYLIST VIDEO (INTERNAL USE)
# --------------------------------

class UserPlaylistVideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserPlaylistVideo
        fields = ['playlist', 'video', 'order', 'added_at']
        read_only_fields = ['added_at']
