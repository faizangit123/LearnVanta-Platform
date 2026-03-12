from django.urls import path
from . import views

urlpatterns = [

    # ---------- PUBLIC: CLASSES ----------
    path("classes/", views.classes_list),
    path("classes/<str:class_id>/", views.class_detail),

    # ---------- PUBLIC: SUBJECTS ----------
    # ⚠️ IMPORTANT: "search" must come BEFORE "<str:class_id>/"
    path("subjects/", views.subjects_list),
    path("subjects/search/", views.search_subjects),
    path("subjects/<str:class_id>/", views.subjects_by_class),

    # ---------- PUBLIC: CHAPTERS ----------
    # ⚠️ IMPORTANT: "search" must come BEFORE "<str:subject_id>/"
    path("chapters/search/", views.search_chapters),
    path("chapters/<str:subject_id>/", views.chapters_by_subject),

    # ---------- PUBLIC: VIDEOS ----------
    # ⚠️ IMPORTANT: all static paths before "<str:video_id>/"
    path("videos/", views.all_videos),
    path("videos/trending/", views.trending_videos),
    path("videos/bulk-update/", views.bulk_update_videos),
    path("videos/bulk-delete/", views.bulk_delete_videos),
    path("videos/chapter/<str:chapter_id>/", views.videos_by_chapter),
    path("videos/<str:video_id>/", views.video_detail),

    # ---------- ADMIN VIDEOS ----------
    path("admin/videos/", views.admin_videos_list),
    path("admin/videos/create/", views.create_video),
    path("admin/videos/<str:video_id>/delete/", views.delete_video),
    path("admin/videos/<str:video_id>/", views.update_video),

    # ---------- PLAYLISTS (ADMIN) ----------
    path("playlists/", views.playlists_list),
    path("playlists/create/", views.create_playlist),
    path("playlists/<str:playlist_id>/", views.update_playlist),
    path("playlists/<str:playlist_id>/delete/", views.delete_playlist),
]