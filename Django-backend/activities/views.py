from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import ActivityLog
from .serializers import ActivityLogSerializer


#  Centralized admin check
def require_admin(user):
    return user.is_authenticated and (user.is_staff or user.is_superuser)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def activities_list(request):
    if not require_admin(request.user):
        return Response({"detail": "Admin access required"}, status=403)

    logs = ActivityLog.objects.all().order_by('-timestamp')[:100]
    serializer = ActivityLogSerializer(logs, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_activity(request):
    if not require_admin(request.user):
        return Response({"detail": "Admin access required"}, status=403)

    serializer = ActivityLogSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(serializer.data, status=201)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def clear_activities(request):
    if not require_admin(request.user):
        return Response({"detail": "Admin access required"}, status=403)

    ActivityLog.objects.all().delete()
    return Response({"success": True})
