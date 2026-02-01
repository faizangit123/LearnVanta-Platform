from django.urls import path
from . import views

urlpatterns = [
    # ---------------------------
    # WATCH HISTORY
    # ---------------------------
    path("history/", views.watch_history_list),
    path("history/<str:video_id>/", views.watch_history_delete),

    # ---------------------------
    # FAVORITES
    # ---------------------------
    path("favorites/", views.favorites_list),
    path("favorites/<str:video_id>/toggle/", views.favorites_toggle),

    # ---------------------------
    # PROGRESS (CONTINUE WATCHING)
    # ---------------------------
    path("progress/<str:video_id>/", views.progress_detail),

    # ---------------------------
    # NOTES
    # ---------------------------
    path("notes/video/<str:video_id>/", views.notes_by_video),

    # ---------------------------
    # USER PLAYLISTS
    # ---------------------------
    path("playlists/", views.playlists_list),
    path("playlists/<str:playlist_id>/add-video/", views.playlists_add_video),
    path("playlists/<str:playlist_id>/remove-video/", views.playlists_remove_video),
    path("playlists/<str:playlist_id>/reorder/", views.playlists_reorder),
]
