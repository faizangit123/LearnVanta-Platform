from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.utils import timezone

from .models import ActivityLog
from .serializers import ActivityLogSerializer
from datetime import timedelta


# ----------------------------------
# Centralized admin check
# ----------------------------------
def require_admin(user):
    return user.is_authenticated and (user.is_staff or user.is_superuser)

# ----------------------------------
# GET ALL ACTIVITIES (ADMIN ONLY)
# ----------------------------------
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def activities_list(request):
    if not require_admin(request.user):
        return Response({"detail": "Admin access required"}, status=403)

    logs = ActivityLog.objects.all().order_by('-timestamp')[:100]
    serializer = ActivityLogSerializer(logs, many=True)
    return Response(serializer.data)


# ----------------------------------
# CREATE ACTIVITY
# ----------------------------------
@api_view(["POST"])
@permission_classes([AllowAny])
def create_activity(request):
    """
    Frontend sends: { type, details }
    Backend injects: user + timestamp
    Logging must NEVER crash the app.
    """
    try:
        # ✅ FIX: Safely handle anonymous users — user.id is None when not authenticated
        user_id = request.user.id if request.user.is_authenticated else None

        serializer = ActivityLogSerializer(data={
            "type": request.data.get("type"),
            "details": request.data.get("details", {}),
            "user": user_id,
            "timestamp": timezone.now(),
        })

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)

    except Exception:
        # Swallow all logging errors — never crash the app for activity logging
        pass

    return Response({"ignored": True}, status=200)


# ----------------------------------
# CLEAR ACTIVITIES (ADMIN ONLY)
# ----------------------------------
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def clear_activities(request):
    if not require_admin(request.user):
        return Response({"detail": "Admin access required"}, status=403)

    ActivityLog.objects.all().delete()
    return Response({"success": True})


# ----------------------------------
# RECENT (last N)
# ----------------------------------
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def activities_recent(request):
    if not require_admin(request.user):
        return Response({"detail": "Admin access required"}, status=403)

    limit = int(request.query_params.get("limit", 20))
    logs = ActivityLog.objects.all().order_by('-timestamp')[:limit]
    serializer = ActivityLogSerializer(logs, many=True)
    return Response(serializer.data)


# ----------------------------------
# STATS
# ----------------------------------
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def activities_stats(request):
    if not require_admin(request.user):
        return Response({"detail": "Admin access required"}, status=403)

    now = timezone.now()
    last_24h = now - timedelta(hours=24)
    last_7d = now - timedelta(days=7)

    logs = ActivityLog.objects.all()

    stats = {
        "total": logs.count(),
        "last24h": logs.filter(timestamp__gte=last_24h).count(),
        "last7d": logs.filter(timestamp__gte=last_7d).count(),
        "byType": {}
    }

    for t, _ in ActivityLog.TYPE_CHOICES:
        stats["byType"][t] = logs.filter(type=t).count()

    return Response(stats)