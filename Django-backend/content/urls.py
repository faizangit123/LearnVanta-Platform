from django.urls import path
from . import views

urlpatterns = [
    # ---------- PUBLIC ----------
    path("classes/", views.classes_list),
    path("subjects/", views.subjects_list),  
    path("subjects/<str:class_id>/", views.subjects_by_class),
    path("classes/<str:class_id>/", views.class_detail),
    path("chapters/<str:subject_id>/", views.chapters_by_subject),
    path("subjects/search/", views.search_subjects),
    path("chapters/search/", views.search_chapters),

    # Videos (public)
    path("videos/", views.all_videos),
    path("videos/trending/", views.trending_videos),
    path("videos/chapter/<str:chapter_id>/", views.videos_by_chapter),
    path("videos/<str:video_id>/", views.video_detail),
    
    # ---------- ADMIN VIDEOS ----------
     path("admin/videos/", views.admin_videos_list),
     path("admin/videos/create/", views.create_video),
     path("admin/videos/<str:video_id>/", views.update_video),
     path("admin/videos/<str:video_id>/delete/", views.delete_video),
     
    # ---------- BULK ----------
    path("videos/bulk-update/", views.bulk_update_videos),
    path("videos/bulk-delete/", views.bulk_delete_videos),
]
