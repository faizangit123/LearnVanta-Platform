from django.urls import path
from . import views

urlpatterns = [
    # Public
    path("", views.resource_list),
    
    # Chapter resources (both supported)
    path("chapters/<str:chapter_id>/", views.resources_by_chapter),
    path("chapters/<str:chapter_id>/resources/", views.resources_by_chapter),

    # Resource detail
    path("<str:resource_id>/", views.resource_detail),
    path("<str:resource_id>/track-download/", views.track_download),

    # Admin upload (both supported)
    path("upload/", views.resource_upload),
    path("admin/upload/", views.resource_upload),
]
