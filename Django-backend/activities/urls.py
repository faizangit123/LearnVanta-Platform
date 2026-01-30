from django.urls import path
from . import views

urlpatterns = [
    path("", views.activities_list),
    path("create/", views.create_activity),
    path("clear/", views.clear_activities),
]
