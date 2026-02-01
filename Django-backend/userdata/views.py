from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from .models import (
    WatchHistory,
    WatchProgress,
    Favorite,
    Note,
    UserPlaylist,
    UserPlaylistVideo
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

@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def watch_history_list(request):
    user = request.user

    if request.method == "GET":
        history = WatchHistory.objects.filter(user=user).order_by("-watched_at")
        serializer = WatchHistorySerializer(history, many=True)
        return Response(serializer.data)

    if request.method == "POST":
        video_id = request.data.get("videoId")
        video = get_object_or_404(Video, id=video_id)

        obj, _ = WatchHistory.objects.get_or_create(
            user=user,
            video=video
        )

        serializer = WatchHistorySerializer(obj)
        return Response(serializer.data)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def watch_history_delete(request, video_id):
    WatchHistory.objects.filter(
        user=request.user,
        video_id=video_id
    ).delete()
    return Response({"success": True})


# ---------------------------
# CONTINUE WATCHING
# ---------------------------

@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def progress_detail(request, video_id):
    user = request.user
    video = get_object_or_404(Video, id=video_id)

    obj, _ = WatchProgress.objects.get_or_create(
        user=user,
        video=video
    )

    if request.method == "GET":
        serializer = WatchProgressSerializer(obj)
        return Response(serializer.data)

    if request.method == "POST":
        obj.current_time = request.data.get("currentTime", obj.current_time)
        obj.duration = request.data.get("duration", obj.duration)
        obj.percentage = request.data.get("percentage", obj.percentage)
        obj.save()

        serializer = WatchProgressSerializer(obj)
        return Response(serializer.data)


# ---------------------------
# FAVORITES
# ---------------------------

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def favorites_list(request):
    favorites = Favorite.objects.filter(user=request.user)
    serializer = FavoriteSerializer(favorites, many=True)
    return Response(serializer.data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def favorites_toggle(request, video_id):
    user = request.user
    video = get_object_or_404(Video, id=video_id)

    fav = Favorite.objects.filter(user=user, video=video)

    if fav.exists():
        fav.delete()
    else:
        Favorite.objects.create(user=user, video=video)

    favorites = Favorite.objects.filter(user=user)
    serializer = FavoriteSerializer(favorites, many=True)
    return Response(serializer.data)


# ---------------------------
# NOTES
# ---------------------------

@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def notes_by_video(request, video_id):
    user = request.user
    video = get_object_or_404(Video, id=video_id)

    if request.method == "GET":
        notes = Note.objects.filter(user=user, video=video)
        serializer = NoteSerializer(notes, many=True)
        return Response(serializer.data)

    if request.method == "POST":
        serializer = NoteSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=user, video=video)
            return Response(serializer.data)
        return Response(serializer.errors, status=400)


# ---------------------------
# USER PLAYLISTS
# ---------------------------

@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def playlists_list(request):
    user = request.user

    if request.method == "GET":
        playlists = UserPlaylist.objects.filter(user=user)
        serializer = UserPlaylistSerializer(playlists, many=True)
        return Response(serializer.data)

    if request.method == "POST":
        serializer = UserPlaylistSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=user)
            return Response(serializer.data)
        return Response(serializer.errors, status=400)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def playlists_add_video(request, playlist_id):
    playlist = get_object_or_404(UserPlaylist, id=playlist_id, user=request.user)
    video_id = request.data.get("video_id")
    video = get_object_or_404(Video, id=video_id)

    if not UserPlaylistVideo.objects.filter(playlist=playlist, video=video).exists():
        UserPlaylistVideo.objects.create(
            playlist=playlist,
            video=video,
            order=playlist.playlist_videos.count()
        )

    serializer = UserPlaylistSerializer(playlist)
    return Response(serializer.data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def playlists_remove_video(request, playlist_id):
    playlist = get_object_or_404(UserPlaylist, id=playlist_id, user=request.user)
    video_id = request.data.get("video_id")

    UserPlaylistVideo.objects.filter(
        playlist=playlist,
        video_id=video_id
    ).delete()

    serializer = UserPlaylistSerializer(playlist)
    return Response(serializer.data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def playlists_reorder(request, playlist_id):
    playlist = get_object_or_404(UserPlaylist, id=playlist_id, user=request.user)
    new_order = request.data.get("video_ids", [])

    for index, vid in enumerate(new_order):
        UserPlaylistVideo.objects.filter(
            playlist=playlist,
            video_id=vid
        ).update(order=index)

    serializer = UserPlaylistSerializer(playlist)
    return Response(serializer.data)
