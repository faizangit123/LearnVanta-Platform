from rest_framework import serializers
from .models import Class, Subject, Chapter, Video, Playlist, PlaylistVideo
from userdata.models import WatchHistory



# ===========================
# BASIC STRUCTURE
# ===========================

class ClassSerializer(serializers.ModelSerializer):
    studentCount = serializers.SerializerMethodField()

    class Meta:
        model = Class
        fields = "__all__"

    def get_studentCount(self, obj):
        return (
            WatchHistory.objects
            .filter(video__chapter__subject__class_ref=obj)
            .values("user")
            .distinct()
            .count()
        )
        
# ===========================
# SUBJECT & CHAPTER
# ===========================        

class SubjectSerializer(serializers.ModelSerializer):
    class_name = serializers.CharField(source='class_ref.name', read_only=True)
    chapterCount = serializers.SerializerMethodField()
    videoCount = serializers.SerializerMethodField()
    isPrimary = serializers.BooleanField(source="is_primary", read_only=True)

    class Meta:
        model = Subject
        fields = [
            "id",
            "name",
            "description",
            "icon",
            "isPrimary",      
            "class_name",
            "chapterCount",
            "videoCount",
        ]

    def get_chapterCount(self, obj):
        return obj.chapters.count()

    def get_videoCount(self, obj):
        return Video.objects.filter(chapter__subject=obj).count()

class ChapterSerializer(serializers.ModelSerializer):
    subject_name = serializers.CharField(source='subject.name', read_only=True)
    videoCount = serializers.SerializerMethodField()

    class Meta:
        model = Chapter
        fields = [
            "id",
            "name",
            "subject",
            "subject_name",
            "videoCount",
        ]

    def get_videoCount(self, obj):
        return Video.objects.filter(chapter=obj).count()
    
# ===========================
# VIDEO SERIALIZERS
# ===========================
class VideoSerializer(serializers.ModelSerializer):
    chapterId = serializers.CharField(source='chapter.id', read_only=True)
    chapterName = serializers.CharField(source='chapter.name', read_only=True)

    subjectId = serializers.CharField(source='chapter.subject.id', read_only=True)
    subjectName = serializers.CharField(source='chapter.subject.name', read_only=True)

    classId = serializers.CharField(source='chapter.subject.class_ref.id', read_only=True)
    className = serializers.CharField(source='chapter.subject.class_ref.name', read_only=True)

    isTrending = serializers.BooleanField(source='is_trending')
    videoType = serializers.CharField(source="video_type")
    publishedAt = serializers.DateTimeField(source='published_at', read_only=True)

    class Meta:
        model = Video
        fields = [
            'id',
            'title',
            'description',
            'videoType',
            'youtube_id',
            'youtube_url',
            'video_url',
            'thumbnail',
            'duration',
            'chapterId',
            'chapterName',
            'subjectId',
            'subjectName',
            'classId',
            'className',
            'tags',
            'views',
            'isTrending',
            'publishedAt',
            'is_active',
        ]


class VideoDetailSerializer(serializers.ModelSerializer):
    chapter = ChapterSerializer(read_only=True)
    subject = SubjectSerializer(source="chapter.subject", read_only=True)
    class_data = ClassSerializer(source="chapter.subject.class_ref", read_only=True)

    class Meta:
        model = Video
        fields = "__all__"
        
# ===========================
# VIDEO CREATE / UPDATE
# ===========================

class VideoCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Video
        fields = [
            "title",
            "description",
            "video_type",
            "youtube_id",
            "youtube_url",
            "video_url",
            "thumbnail",
            "duration",
            "chapter",
            "tags",
            "is_trending",
            "is_active",
            ]
        extra_kwargs = {
            "youtube_id": {"required": False, "allow_blank": True},
            "youtube_url": {"required": False, "allow_blank": True},
            "video_url": {"required": False, "allow_blank": True},
            "thumbnail": {"required": False, "allow_blank": True},
            "tags": {"required": False},
            }

# ===========================
# PLAYLIST SERIALIZER
# ===========================

class PlaylistSerializer(serializers.ModelSerializer):
    #  React expects videoIds (array of strings)
    videoIds = serializers.SerializerMethodField()

    #  camelCase mapping
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
        # React crashes if this returns UUID objects
        return [str(v) for v in obj.playlist_videos.values_list('video_id', flat=True)]


