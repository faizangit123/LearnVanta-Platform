from rest_framework import serializers
from .models import WatchHistory, WatchProgress, Favorite, Note, UserPlaylist, UserPlaylistVideo
from content.serializers import VideoSerializer


from django.contrib.auth import get_user_model
User = get_user_model()

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
class WatchHistorySerializer(serializers.ModelSerializer):
    video_id = serializers.CharField(source='video.id')
    title = serializers.CharField(source='video.title')
    thumbnail = serializers.CharField(source='video.thumbnail')
    duration = serializers.CharField(source='video.duration')
    chapter_name = serializers.CharField(source='video.chapter.name')
    progress = serializers.IntegerField(source='progress_percentage')

    class Meta:
        model = WatchHistory
        fields = ['video_id', 'title', 'thumbnail', 'duration', 'chapter_name', 'progress', 'watched_at']


class WatchProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = WatchProgress
        fields = ['current_time', 'duration', 'percentage', 'updated_at']


class FavoriteSerializer(serializers.ModelSerializer):
    video_id = serializers.CharField(source='video.id')
    title = serializers.CharField(source='video.title')
    thumbnail = serializers.CharField(source='video.thumbnail')
    duration = serializers.CharField(source='video.duration')
    chapter_name = serializers.CharField(source='video.chapter.name')

    class Meta:
        model = Favorite
        fields = ['video_id', 'title', 'thumbnail', 'duration', 'chapter_name', 'added_at']


class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ['id', 'video', 'content', 'timestamp', 'is_pinned', 'is_archived', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class UserPlaylistSerializer(serializers.ModelSerializer):
    video_count = serializers.SerializerMethodField()

    class Meta:
        model = UserPlaylist
        fields = ['id', 'name', 'description', 'video_count', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_video_count(self, obj):
        return obj.playlist_videos.count()


class UserPlaylistVideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserPlaylistVideo
        fields = ['playlist', 'video', 'order', 'added_at']
