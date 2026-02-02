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
        
        
        obj, created = WatchHistory.objects.get_or_create(
           user=user,
           video=video
           )
        
        if not created:
           obj.save()  # updates watched_at via auto_now


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
        current = request.data.get("currentTime", obj.current_time)
        duration = request.data.get("duration", obj.duration)
        
        obj.current_time = current
        obj.duration = duration
        obj.percentage = int((current / duration) * 100) if duration else 0
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
        is_favorite = False
    else:
        Favorite.objects.create(user=user, video=video)
        is_favorite = True

    favorites = Favorite.objects.filter(user=user)
    serializer = FavoriteSerializer(favorites, many=True)

    return Response({
        "favorites": serializer.data,
        "isFavorite": is_favorite
    })

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

    # 1. Validate input
    if not video_id:
        return Response(
            {"error": "video_id is required"},
            status=400
        )

    # 2. Delete the video
    UserPlaylistVideo.objects.filter(
        playlist=playlist,
        video_id=video_id
    ).delete()

    # 3. Re-index remaining videos (CRITICAL)
    remaining = UserPlaylistVideo.objects.filter(
        playlist=playlist
    ).order_by("order")

    for index, item in enumerate(remaining):
        item.order = index
        item.save(update_fields=["order"])

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
