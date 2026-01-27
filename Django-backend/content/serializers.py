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


class VideoSerializer(serializers.ModelSerializer):
    chapter_name = serializers.CharField(source='chapter.name', read_only=True)
    subject_id = serializers.CharField(source='chapter.subject.id', read_only=True)

    class Meta:
        model = Video
        fields = '__all__'


class VideoCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Video
        fields = ['id', 'title', 'description', 'video_type', 'youtube_id', 'youtube_url', 
                  'video_url', 'thumbnail', 'duration', 'chapter', 'tags', 'is_trending']


class PlaylistSerializer(serializers.ModelSerializer):
    video_ids = serializers.SerializerMethodField()

    class Meta:
        model = Playlist
        fields = '__all__'

    def get_video_ids(self, obj):
        return list(obj.playlist_videos.values_list('video_id', flat=True))
