from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework import status

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
        return Response(serializer.data, status=status.HTTP_200_OK)

    if request.method == "POST":
        video_id = request.data.get("video_id")
        if not video_id:
            return Response({"error": "video_id required"}, status=400)

        video = get_object_or_404(Video, id=video_id)

        obj, created = WatchHistory.objects.get_or_create(
            user=user,
            video=video
        )

        if not created:
            obj.save()  # updates watched_at via auto_now

        serializer = WatchHistorySerializer(obj)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def watch_history_delete(request, video_id):
    WatchHistory.objects.filter(
        user=request.user,
        video_id=video_id
    ).delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


# ---------------------------
# WATCH PROGRESS
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
        return Response(serializer.data, status=status.HTTP_200_OK)

    if request.method == "POST":
        current = request.data.get("current_time", obj.current_time)
        duration = request.data.get("duration", obj.duration)

        try:
            current = float(current)
            duration = float(duration)
        except:
            return Response({"error": "Invalid progress values"}, status=400)

        obj.current_time = current
        obj.duration = duration
        obj.percentage = int((current / duration) * 100) if duration > 0 else 0
        obj.save()

        serializer = WatchProgressSerializer(obj)
        return Response(serializer.data, status=status.HTTP_200_OK)


# ---------------------------
# FAVORITES
# ---------------------------

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def favorites_list(request):
    favorites = Favorite.objects.filter(user=request.user)
    serializer = FavoriteSerializer(favorites, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


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

    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def favorites_add(request, video_id):
    user = request.user
    video = get_object_or_404(Video, id=video_id)

    Favorite.objects.get_or_create(user=user, video=video)

    favorites = Favorite.objects.filter(user=user)
    serializer = FavoriteSerializer(favorites, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def favorites_remove(request, video_id):
    Favorite.objects.filter(
        user=request.user,
        video_id=video_id
    ).delete()

    favorites = Favorite.objects.filter(user=request.user)
    serializer = FavoriteSerializer(favorites, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)



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
        return Response(serializer.data, status=status.HTTP_200_OK)

    if request.method == "POST":
        serializer = NoteSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=user, video=video)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=400)
    
#-------------------------------------

@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def notes_list_create(request):
    if request.method == "GET":
        notes = Note.objects.filter(user=request.user)
        serializer = NoteSerializer(notes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    if request.method == "POST":
        serializer = NoteSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=400)


@api_view(["PATCH", "DELETE"])
@permission_classes([IsAuthenticated])
def note_detail(request, note_id):
    note = get_object_or_404(Note, id=note_id, user=request.user)

    if request.method == "PATCH":
        serializer = NoteSerializer(note, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=400)

    if request.method == "DELETE":
        note.delete()
        return Response(status=204)


#-----------------------------------    
    


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
        return Response(serializer.data, status=status.HTTP_200_OK)

    if request.method == "POST":
        serializer = UserPlaylistSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=400)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def playlists_add_video(request, playlist_id):
    playlist = get_object_or_404(UserPlaylist, id=playlist_id, user=request.user)
    video_id = request.data.get("video_id")

    if not video_id:
        return Response({"error": "video_id required"}, status=400)

    video = get_object_or_404(Video, id=video_id)

    if not UserPlaylistVideo.objects.filter(
        playlist=playlist,
        video=video
    ).exists():
        UserPlaylistVideo.objects.create(
            playlist=playlist,
            video=video,
            order=playlist.playlist_videos.count()
        )

    playlist.refresh_from_db()
    serializer = UserPlaylistSerializer(playlist)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def playlists_remove_video(request, playlist_id):
    playlist = get_object_or_404(UserPlaylist, id=playlist_id, user=request.user)
    video_id = request.data.get("video_id")

    if not video_id:
        return Response({"error": "video_id required"}, status=400)

    UserPlaylistVideo.objects.filter(
        playlist=playlist,
        video_id=video_id
    ).delete()

    # Re-index remaining videos
    remaining = UserPlaylistVideo.objects.filter(
        playlist=playlist
    ).order_by("order")

    for index, item in enumerate(remaining):
        item.order = index
        item.save(update_fields=["order"])
        
    playlist.refresh_from_db()
    serializer = UserPlaylistSerializer(playlist)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def playlists_reorder(request, playlist_id):
    playlist = get_object_or_404(UserPlaylist, id=playlist_id, user=request.user)
    new_order = request.data.get("video_ids", [])

    if not isinstance(new_order, list):
        return Response({"error": "video_ids must be a list"}, status=400)

    for index, vid in enumerate(new_order):
        UserPlaylistVideo.objects.filter(
            playlist=playlist,
            video_id=vid
        ).update(order=index)
    playlist.refresh_from_db()
    serializer = UserPlaylistSerializer(playlist)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(["GET", "DELETE"])
@permission_classes([IsAuthenticated])
def playlist_detail(request, playlist_id):
    try:
        playlist = UserPlaylist.objects.get(
            id=playlist_id,
            user=request.user
        )
    except UserPlaylist.DoesNotExist:
        return Response(
            {"detail": "Playlist not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    if request.method == "GET":
        return Response({
            "id": playlist.id,
            "title": playlist.title,
            "description": playlist.description,
            "is_public": playlist.is_public,
            "video_ids": list(
                playlist.videos.values_list("id", flat=True)
            ),"created_at": playlist.created_at,
            },status=status.HTTP_200_OK)

    if request.method == "DELETE":
        playlist.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
