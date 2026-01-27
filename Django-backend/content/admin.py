from django.contrib import admin
from .models import Class, Subject, Chapter, Video, Playlist, PlaylistVideo


@admin.register(Class)
class ClassAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'order', 'is_active']
    list_editable = ['order', 'is_active']
    search_fields = ['name', 'description']


@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'class_ref', 'chapter_count', 'order', 'is_active']
    list_filter = ['class_ref', 'is_active']
    list_editable = ['order', 'is_active']
    search_fields = ['name', 'description']


@admin.register(Chapter)
class ChapterAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'subject', 'video_count', 'order', 'is_active']
    list_filter = ['subject__class_ref', 'subject', 'is_active']
    list_editable = ['order', 'is_active']
    search_fields = ['name', 'description']


@admin.register(Video)
class VideoAdmin(admin.ModelAdmin):
    list_display = ['id', 'title', 'chapter', 'video_type', 'views', 'is_trending', 'is_active']
    list_filter = ['video_type', 'is_trending', 'is_recent', 'is_active', 'chapter__subject']
    search_fields = ['title', 'description', 'tags']
    list_editable = ['is_trending', 'is_active']


@admin.register(Playlist)
class PlaylistAdmin(admin.ModelAdmin):
    list_display = ['id', 'title', 'chapter', 'is_public', 'created_at']
    list_filter = ['is_public']
    search_fields = ['title', 'description']


@admin.register(PlaylistVideo)
class PlaylistVideoAdmin(admin.ModelAdmin):
    list_display = ['playlist', 'video', 'order']
    list_filter = ['playlist']
    list_editable = ['order']
