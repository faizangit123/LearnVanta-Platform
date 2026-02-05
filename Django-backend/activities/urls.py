from django.urls import path
from . import views

urlpatterns = [
    # List last 100 activities (admin only)
    path("", views.activities_list, name="activities-list"),

    # Manually create activity (admin only)
    path("create/", views.create_activity, name="activities-create"),

    # Clear all logs (admin only - dangerous)
    path("clear/", views.clear_activities, name="activities-clear"),
    
    path("recent/", views.activities_recent, name="activities-recent"),
    path("stats/", views.activities_stats, name="activities-stats"),
]
