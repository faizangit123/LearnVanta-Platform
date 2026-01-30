from django.urls import path
from . import views

urlpatterns = [
    path('history/', views.watch_history_list),
    path('history/<int:video_id>/', views.watch_history_delete),
]
