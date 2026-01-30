from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from .models import (
    WatchHistory,
    WatchProgress,
    Favorite,
    Note,
    UserPlaylist
)

from .serializers import (
    WatchHistorySerializer,
    WatchProgressSerializer,
    FavoriteSerializer,
    NoteSerializer,
    UserPlaylistSerializer
)

from content.models import Video


# ---------------------------
# WATCH HISTORY
# ---------------------------

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def watch_history_list(request):
    user = request.user

    if request.method == 'GET':
        history = WatchHistory.objects.filter(user=user)
        serializer = WatchHistorySerializer(history, many=True)
        return Response(serializer.data)

    if request.method == 'POST':
        video_id = request.data.get('video')
        video = get_object_or_404(Video, id=video_id)

        obj, created = WatchHistory.objects.get_or_create(
            user=user,
            video=video
        )
        serializer = WatchHistorySerializer(obj)
        return Response(serializer.data)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def watch_history_delete(request, video_id):
    WatchHistory.objects.filter(
        user=request.user,
        video_id=video_id
    ).delete()
    return Response({"success": True})


# ---------------------------
# FAVORITES
# ---------------------------

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def favorites_list(request):
    favorites = Favorite.objects.filter(user=request.user)
    serializer = FavoriteSerializer(favorites, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def favorites_toggle(request, video_id):
    video = get_object_or_404(Video, id=video_id)

    fav = Favorite.objects.filter(
        user=request.user,
        video=video
    ).first()

    if fav:
        fav.delete()
        return Response({"favorited": False})
    else:
        Favorite.objects.create(
            user=request.user,
            video=video
        )
        return Response({"favorited": True})


# ---------------------------
# WATCH PROGRESS
# ---------------------------

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def progress_detail(request, video_id):
    progress = WatchProgress.objects.filter(
        user=request.user,
        video_id=video_id
    ).first()

    if not progress:
        return Response({
            "current_time": 0,
            "duration": 0,
            "percentage": 0
        })

    serializer = WatchProgressSerializer(progress)
    return Response(serializer.data)


# ---------------------------
# NOTES
# ---------------------------

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def notes_by_video(request, video_id):
    notes = Note.objects.filter(
        user=request.user,
        video_id=video_id
    )
    serializer = NoteSerializer(notes, many=True)
    return Response(serializer.data)


# ---------------------------
# USER PLAYLISTS
# ---------------------------

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def playlists_list(request):
    playlists = UserPlaylist.objects.filter(user=request.user)
    serializer = UserPlaylistSerializer(playlists, many=True)
    return Response(serializer.data)
