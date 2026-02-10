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
    VideoDetailSerializer,  
    VideoCreateSerializer,
    PlaylistSerializer
)

from django.db.models import Q


# ===========================
# PUBLIC APIs
# ===========================

@api_view(['GET'])
@permission_classes([AllowAny])
def all_videos(request):
    q = request.query_params.get("search", "").strip()
    ordering = request.query_params.get("ordering", "-published_at")

    videos = (Video.objects.filter(is_active=True).select_related(
        "chapter",
        "chapter__subject",
        "chapter__subject__class_ref"\
            )
              )


    if q:
        videos = videos.filter(
            Q(title__icontains=q) |
            Q(description__icontains=q)
        )
        
    allowed_ordering = {
        "published_at": "published_at",
        "-published_at": "-published_at",
        "views": "views",
        "-views": "-views",
    }

    videos = videos.order_by(
        allowed_ordering.get(ordering, "-published_at")
    )

    return Response(VideoSerializer(videos, many=True).data)


@api_view(['GET'])
@permission_classes([AllowAny])
def classes_list(request):
    data = Class.objects.filter(is_active=True)
    return Response(ClassSerializer(data, many=True).data)

@api_view(['GET'])
@permission_classes([AllowAny])
def class_detail(request, class_id):
    cls = get_object_or_404(Class, id=class_id, is_active=True)
    return Response(ClassSerializer(cls).data)

@api_view(["GET"])
def subjects_list(request):
    """
    Return all active subjects (admin + dashboard use)
    """
    subjects = Subject.objects.filter(is_active=True).select_related("class_ref").order_by("order")
    serializer = SubjectSerializer(subjects, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def subjects_by_class(request, class_id):
    data = Subject.objects.filter(class_ref__id=class_id, is_active=True)
    return Response(SubjectSerializer(data, many=True).data)

@api_view(['GET'])
@permission_classes([AllowAny])
def chapters_by_subject(request, subject_id):
    data = Chapter.objects.filter(subject_id=subject_id, is_active=True)
    return Response(ChapterSerializer(data, many=True).data)

@api_view(['GET'])
@permission_classes([AllowAny])
def videos_by_chapter(request, chapter_id):
    videos = Video.objects.filter(chapter_id=chapter_id,is_active=True).select_related("chapter__subject__class_ref")
    serializer = VideoSerializer(videos, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def video_detail(request, video_id):
    video = get_object_or_404(Video, id=video_id, is_active=True)
    return Response(VideoDetailSerializer(video).data)

@api_view(['GET'])
@permission_classes([AllowAny])
def trending_videos(request):
    data = Video.objects.filter(is_trending=True, is_active=True)
    return Response(VideoSerializer(data, many=True).data)


@api_view(["GET"])
@permission_classes([AllowAny])
def search_subjects(request):
    q = request.query_params.get("q", "")
    subjects = Subject.objects.filter(name__icontains=q)
    serializer = SubjectSerializer(subjects, many=True)
    return Response(serializer.data)

@api_view(["GET"])
@permission_classes([AllowAny])
def search_chapters(request):
    q = request.query_params.get("q", "")
    chapters = Chapter.objects.filter(name__icontains=q)
    serializer = ChapterSerializer(chapters, many=True)
    return Response(serializer.data)



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
    video = serializer.save()
    return Response(VideoSerializer(video).data, status=201)


@api_view(['PATCH'])
@permission_classes([IsAdminUser])
def update_video(request, video_id):
    video = get_object_or_404(Video, id=video_id)
    serializer = VideoCreateSerializer(video, data=request.data, partial=True)
    serializer.is_valid(raise_exception=True)
    video = serializer.save()
    return Response(VideoSerializer(video).data)


@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def delete_video(request, video_id):
    video = get_object_or_404(Video, id=video_id)
    video.delete()
    return Response({"success": True})


@api_view(['POST'])
@permission_classes([IsAdminUser])
def bulk_update_videos(request):
    ids = request.data.get("video_ids", [])
    updates = request.data.get("updates", {})
    Video.objects.filter(id__in=ids).update(**updates)
    return Response({"updatedCount": len(ids)})


@api_view(['POST'])
@permission_classes([IsAdminUser])
def bulk_delete_videos(request):
    ids = request.data.get("video_ids", [])
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
    playlist = serializer.save()
    return Response(PlaylistSerializer(playlist).data, status=201)


@api_view(['PATCH'])
@permission_classes([IsAdminUser])
def update_playlist(request, playlist_id):
    playlist = get_object_or_404(Playlist, id=playlist_id)
    serializer = PlaylistSerializer(playlist, data=request.data, partial=True)
    serializer.is_valid(raise_exception=True)
    playlist = serializer.save()
    return Response(PlaylistSerializer(playlist).data)


@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def delete_playlist(request, playlist_id):
    playlist = get_object_or_404(Playlist, id=playlist_id)
    playlist.delete()
    return Response({"success": True})



