from django.urls import path
from . import views

urlpatterns = [
    # Watch History
    path('history/', views.watch_history_list),
    path('history/<int:video_id>/', views.watch_history_delete),

    # Favorites
    path('favorites/', views.favorites_list),
    path('favorites/<int:video_id>/', views.favorites_toggle),

    # Progress
    path('progress/<int:video_id>/', views.progress_detail),

    # Notes
    path('notes/video/<int:video_id>/', views.notes_by_video),
]
