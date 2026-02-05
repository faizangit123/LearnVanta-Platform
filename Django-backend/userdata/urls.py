from django.urls import path
from . import views

urlpatterns = [
    # ---------------------------
    # WATCH HISTORY
    # ---------------------------
    path("history/", views.watch_history_list, name="watch-history"),
    path("history/<str:video_id>/", views.watch_history_delete, name="watch-history-delete"),

    # ---------------------------
    # FAVORITES
    # ---------------------------
    path("favorites/", views.favorites_list, name="favorites"),
    path("favorites/<str:video_id>/toggle/", views.favorites_toggle, name="favorites-toggle"),

    # ---------------------------
    # WATCH PROGRESS
    # ---------------------------
    path("progress/<str:video_id>/", views.progress_detail, name="progress"),

    # ---------------------------
    # NOTES
    # ---------------------------
    path("notes/", views.notes_list_create),
    path("notes/video/<str:video_id>/", views.notes_by_video, name="notes-by-video"),
    path("notes/<str:note_id>/", views.note_detail),

    # ---------------------------
    # USER PLAYLISTS
    # ---------------------------
    path("playlists/", views.playlists_list, name="user-playlists"),
    path("playlists/<str:playlist_id>/add-video/", views.playlists_add_video, name="playlist-add-video"),
    path("playlists/<str:playlist_id>/remove-video/", views.playlists_remove_video, name="playlist-remove-video"),
    path("playlists/<str:playlist_id>/reorder/", views.playlists_reorder, name="playlist-reorder"),
    
]
