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

# ===========================
# PUBLIC APIs
# ===========================

@api_view(['GET'])
@permission_classes([AllowAny])
def all_videos(request):
    data = Video.objects.filter(is_active=True)
    return Response(VideoSerializer(data, many=True).data)

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

# ===========================
# ADMIN APIs
# ===========================

@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_videos_list(request):
    videos = Video.objects.all()
    return Response(VideoSerializer(videos, many=True).data)

@api_view(['POST'])
@permission_classes([IsAdminUser])
def create_video(request):
    serializer = VideoCreateSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(serializer.data, status=201)

@api_view(['PATCH'])
@permission_classes([IsAdminUser])
def update_video(request, video_id):
    video = get_object_or_404(Video, id=video_id)
    serializer = VideoCreateSerializer(video, data=request.data, partial=True)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(serializer.data)

@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def delete_video(request, video_id):
    video = get_object_or_404(Video, id=video_id)
    video.delete()
    return Response({"success": True})

@api_view(['POST'])
@permission_classes([IsAdminUser])
def bulk_update_videos(request):
    ids = request.data.get("ids", [])
    updates = request.data.get("updates", {})
    Video.objects.filter(id__in=ids).update(**updates)
    return Response({"updatedCount": len(ids)})

@api_view(['POST'])
@permission_classes([IsAdminUser])
def bulk_delete_videos(request):
    ids = request.data.get("ids", [])
    deleted, _ = Video.objects.filter(id__in=ids).delete()
    return Response({"deletedCount": deleted})

# ===========================
# PLAYLIST ADMIN
# ===========================

@api_view(['GET'])
@permission_classes([IsAdminUser])
def playlists_list(request):
    data = Playlist.objects.all()
    return Response(PlaylistSerializer(data, many=True).data)

@api_view(['POST'])
@permission_classes([IsAdminUser])
def create_playlist(request):
    serializer = PlaylistSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(serializer.data, status=201)

@api_view(['PATCH'])
@permission_classes([IsAdminUser])
def update_playlist(request, playlist_id):
    playlist = get_object_or_404(Playlist, id=playlist_id)
    serializer = PlaylistSerializer(playlist, data=request.data, partial=True)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(serializer.data)

@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def delete_playlist(request, playlist_id):
    playlist = get_object_or_404(Playlist, id=playlist_id)
    playlist.delete()
    return Response({"success": True})
