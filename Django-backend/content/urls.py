from django.urls import path
from . import views

urlpatterns = [
    # ---------- PUBLIC ----------
    path("classes/", views.classes_list),
    path("subjects/<str:class_id>/", views.subjects_by_class),
    path("chapters/<str:subject_id>/", views.chapters_by_subject),

    # Videos
    path("videos/", views.all_videos),                     
    path("videos/chapter/<str:chapter_id>/", views.videos_by_chapter),
    path("videos/<str:video_id>/", views.video_detail),
    path("videos/trending/", views.trending_videos),

    # ---------- ADMIN ----------
    path("admin/videos/", views.create_video),             # POST
    path("admin/playlists/", views.playlists_list),        # GET
]
