from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response

from .models import ActivityLog
from .serializers import ActivityLogSerializer


@api_view(['GET'])
@permission_classes([IsAdminUser])
def activities_list(request):
    logs = ActivityLog.objects.all()[:100]
    serializer = ActivityLogSerializer(logs, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAdminUser])
def create_activity(request):
    serializer = ActivityLogSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(serializer.data, status=201)


@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def clear_activities(request):
    ActivityLog.objects.all().delete()
    return Response({"success": True})
