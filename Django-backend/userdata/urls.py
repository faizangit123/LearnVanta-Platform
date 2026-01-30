from django.urls import path
from . import views

urlpatterns = [
    path('history/', views.watch_history_list),
    path('history/<int:video_id>/', views.watch_history_delete),

    path('favorites/', views.favorites_list),
    path('playlists/', views.playlists_list),
    path('progress/<int:video_id>/', views.progress_detail),
    path('notes/video/<int:video_id>/', views.notes_by_video),
]

