from django.urls import path
from . import views

urlpatterns = [
    # History
    path("history/", views.watch_history_list),
    path("history/<uuid:video_id>/", views.watch_history_delete),

    # Favorites
    path("favorites/", views.favorites_list),
    path("favorites/<uuid:video_id>/toggle/", views.favorites_toggle),

    # Playlists
    path("playlists/", views.playlists_list),

    # Progress
    path("progress/<uuid:video_id>/", views.progress_detail),

    # Notes
    path("notes/video/<uuid:video_id>/", views.notes_by_video),
]
