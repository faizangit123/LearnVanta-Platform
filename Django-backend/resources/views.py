from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from .models import Resource
from .serializers import ResourceSerializer


# ---------------------------
# PUBLIC
# ---------------------------

@api_view(['GET'])
def resource_list(request):
    resources = Resource.objects.all().order_by("-created_at")
    serializer = ResourceSerializer(resources, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def resources_by_chapter(request, chapter_id):
    resources = Resource.objects.filter(chapter_id=chapter_id).order_by("-created_at")
    serializer = ResourceSerializer(resources, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def resource_detail(request, resource_id):
    resource = get_object_or_404(Resource, id=resource_id)
    serializer = ResourceSerializer(resource)
    return Response(serializer.data)


# ---------------------------
# ADMIN
# ---------------------------

@api_view(['POST'])
@permission_classes([IsAdminUser])
def resource_upload(request):
    serializer = ResourceSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    serializer.save(uploaded_by=request.user)
    return Response(serializer.data, status=201)


# ---------------------------
# TRACKING
# ---------------------------

@api_view(['POST'])
def track_download(request, resource_id):
    resource = get_object_or_404(Resource, id=resource_id)
    resource.download_count += 1
    resource.save()
    return Response({"success": True})
