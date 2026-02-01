from django.urls import path
from . import views

urlpatterns = [
    # Public
    path("", views.resource_list),
    path("chapters/<str:chapter_id>/", views.resources_by_chapter),
    path("<uuid:resource_id>/", views.resource_detail),
    path("<uuid:resource_id>/track-download/", views.track_download),

    # Admin
    path("admin/upload/", views.resource_upload),
]
