from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from .models import Class, Subject, Chapter, Video, Playlist
from .serializers import (
    ClassSerializer,
    SubjectSerializer,
    ChapterSerializer,
    VideoSerializer,
    VideoCreateSerializer,
    PlaylistSerializer
)

# ---------- PUBLIC APIs ----------

@api_view(['GET'])
@permission_classes([AllowAny])
def classes_list(request):
    data = Class.objects.filter(is_active=True)
    return Response(ClassSerializer(data, many=True).data)

@api_view(['GET'])
@permission_classes([AllowAny])
def subjects_by_class(request, class_id):
    data = Subject.objects.filter(class_ref_id=class_id, is_active=True)
    return Response(SubjectSerializer(data, many=True).data)

@api_view(['GET'])
@permission_classes([AllowAny])
def chapters_by_subject(request, subject_id):
    data = Chapter.objects.filter(subject_id=subject_id, is_active=True)
    return Response(ChapterSerializer(data, many=True).data)

@api_view(['GET'])
@permission_classes([AllowAny])
def videos_by_chapter(request, chapter_id):
    data = Video.objects.filter(chapter_id=chapter_id, is_active=True)
    return Response(VideoSerializer(data, many=True).data)

@api_view(['GET'])
@permission_classes([AllowAny])
def video_detail(request, video_id):
    video = get_object_or_404(Video, id=video_id)
    return Response(VideoSerializer(video).data)

@api_view(['GET'])
@permission_classes([AllowAny])
def trending_videos(request):
    data = Video.objects.filter(is_trending=True, is_active=True)
    return Response(VideoSerializer(data, many=True).data)


# ---------- ADMIN APIs ----------

@api_view(['POST'])
@permission_classes([IsAdminUser])
def create_video(request):
    serializer = VideoCreateSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(serializer.data, status=201)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def playlists_list(request):
    data = Playlist.objects.all()
    return Response(PlaylistSerializer(data, many=True).data)
