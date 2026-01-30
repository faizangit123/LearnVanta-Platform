from django.urls import path
from . import views

urlpatterns = [
    path("", views.resource_list),
    path("<uuid:resource_id>/", views.resource_detail),
    path("<uuid:resource_id>/track-download/", views.track_download),
    path("upload/", views.resource_upload),
    path("chapters/<str:chapter_id>/", views.resources_by_chapter),
]
