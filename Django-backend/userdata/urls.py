from django.urls import path
from . import views

urlpatterns = [
    # History
    path("history/", views.watch_history_list),
    path("history/<str:video_id>/", views.watch_history_delete),

    # Favorites
    path("favorites/", views.favorites_list),
    path("favorites/<str:video_id>/toggle/", views.favorites_toggle),

    # Playlists
    path("playlists/", views.playlists_list),

    # Progress
    path("progress/<str:video_id>/", views.progress_detail),

    # Notes
    path("notes/video/<str:video_id>/", views.notes_by_video),
]
