from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from content.models import Chapter
from .models import Resource
from .serializers import ResourceSerializer


# ---------------------------
# PUBLIC
# ---------------------------

@api_view(['GET'])
def resource_list(request):
    # Only expose public resources
    resources = Resource.objects.filter(is_public=True).order_by("-created_at")
    
    #  FIX: pass request in context (for file_url)
    serializer = ResourceSerializer(
        resources, 
        many=True, 
        context={"request": request}
    )
    return Response(serializer.data)


@api_view(['GET'])
def resources_by_chapter(request, chapter_id):
    resources = Resource.objects.filter(
        chapter_id=chapter_id,
        is_public=True
    ).order_by("-created_at")
    
    # 🔧 FIX: pass request in context
    serializer = ResourceSerializer(
        resources, 
        many=True, 
        context={"request": request}
    )
    return Response(serializer.data)


@api_view(['GET'])
def resource_detail(request, resource_id):
    resource = get_object_or_404(Resource, id=resource_id, is_public=True)
    
    # 🔧 FIX: pass request in context
    serializer = ResourceSerializer(
        resource, 
        context={"request": request}
    )
    return Response(serializer.data)


# ---------------------------
# ADMIN
# ---------------------------

@api_view(['POST'])
@permission_classes([IsAdminUser])
def resource_upload(request):
    # Ensure chapter exists
    chapter_id = request.data.get("chapter_id")
    get_object_or_404(Chapter, id=chapter_id)

    # 🔧 FIX: DRF already handles files in request.data
    serializer = ResourceSerializer(
        data=request.data,
        context={"request": request}   # 🔧 important
    )
    serializer.is_valid(raise_exception=True)
    serializer.save(uploaded_by=request.user)
    return Response(serializer.data, status=201)


# ---------------------------
# TRACKING
# ---------------------------

@api_view(['POST'])
@permission_classes([IsAuthenticated])   # Prevent fake spam
def track_download(request, resource_id):
    resource = get_object_or_404(Resource, id=resource_id)
    resource.download_count += 1
    resource.save(update_fields=["download_count"])
    return Response({"success": True})
