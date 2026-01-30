from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import WatchHistory
from .serializers import WatchHistorySerializer
from content.models import Video

from django.shortcuts import get_object_or_404


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def watch_history_list(request):
    user = request.user

    if request.method == 'GET':
        history = WatchHistory.objects.filter(user=user).order_by('-watched_at')
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
    user = request.user
    WatchHistory.objects.filter(user=user, video_id=video_id).delete()
    return Response({"success": True})
