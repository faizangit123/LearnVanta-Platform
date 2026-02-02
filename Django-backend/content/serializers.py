from rest_framework import serializers
from .models import Class, Subject, Chapter, Video, Playlist, PlaylistVideo


class ClassSerializer(serializers.ModelSerializer):
    class Meta:
        model = Class
        fields = '__all__'


class SubjectSerializer(serializers.ModelSerializer):
    class_name = serializers.CharField(source='class_ref.name', read_only=True)

    class Meta:
        model = Subject
        fields = '__all__'


class ChapterSerializer(serializers.ModelSerializer):
    subject_name = serializers.CharField(source='subject.name', read_only=True)

    class Meta:
        model = Chapter
        fields = '__all__'


# ===========================
# VIDEO SERIALIZERS
# ===========================

class VideoSerializer(serializers.ModelSerializer):
    chapterName = serializers.CharField(source='chapter.name', read_only=True)
    subjectId = serializers.CharField(source='chapter.subject.id', read_only=True)
    isTrending = serializers.BooleanField(source='is_trending')
    publishedAt = serializers.DateTimeField(source='created_at')

    class Meta:
        model = Video
        fields = [
            'id',
            'title',
            'description',
            'video_type',
            'youtube_id',
            'youtube_url',
            'video_url',
            'thumbnail',
            'duration',
            'chapter',
            'chapterName',
            'subjectId',
            'tags',
            'views',
            'isTrending',
            'publishedAt',
            'is_active'
        ]


class VideoCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Video
        fields = [
            'id',
            'title',
            'description',
            'video_type',
            'youtube_id',
            'youtube_url',
            'video_url',
            'thumbnail',
            'duration',
            'chapter',
            'tags',
            'is_trending'
        ]


# ===========================
# PLAYLIST SERIALIZER
# ===========================

class PlaylistSerializer(serializers.ModelSerializer):
    videoIds = serializers.SerializerMethodField()
    isPublic = serializers.BooleanField(source='is_public')
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)
    updatedAt = serializers.DateTimeField(source='updated_at', read_only=True)

    class Meta:
        model = Playlist
        fields = [
            'id',
            'title',
            'description',
            'thumbnail',
            'videoIds',
            'isPublic',
            'createdAt',
            'updatedAt'
        ]

    def get_videoIds(self, obj):
        # 🔧 FIX: force list of strings (React expects strings, not UUID objects)
        return list(
            obj.playlist_videos.values_list('video_id', flat=True)
        )
