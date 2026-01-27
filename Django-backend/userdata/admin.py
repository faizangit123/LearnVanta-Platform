from django.contrib import admin
from .models import WatchHistory, WatchProgress, Favorite, Note, UserPlaylist, UserPlaylistVideo


@admin.register(WatchHistory)
class WatchHistoryAdmin(admin.ModelAdmin):
    list_display = ['user', 'video', 'progress_percentage', 'watched_at']
    list_filter = ['watched_at']
    search_fields = ['user__email', 'video__title']
    readonly_fields = ['watched_at']


@admin.register(WatchProgress)
class WatchProgressAdmin(admin.ModelAdmin):
    list_display = ['user', 'video', 'percentage', 'updated_at']
    list_filter = ['updated_at']
    search_fields = ['user__email', 'video__title']
    readonly_fields = ['updated_at']


@admin.register(Favorite)
class FavoriteAdmin(admin.ModelAdmin):
    list_display = ['user', 'video', 'added_at']
    list_filter = ['added_at']
    search_fields = ['user__email', 'video__title']
    readonly_fields = ['added_at']


@admin.register(Note)
class NoteAdmin(admin.ModelAdmin):
    list_display = ['user', 'video', 'is_pinned', 'is_archived', 'created_at']
    list_filter = ['is_pinned', 'is_archived', 'created_at']
    search_fields = ['user__email', 'video__title', 'content']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(UserPlaylist)
class UserPlaylistAdmin(admin.ModelAdmin):
    list_display = ['user', 'name', 'created_at']
    list_filter = ['created_at']
    search_fields = ['user__email', 'name']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(UserPlaylistVideo)
class UserPlaylistVideoAdmin(admin.ModelAdmin):
    list_display = ['playlist', 'video', 'order', 'added_at']
    list_filter = ['added_at']
    list_editable = ['order']
    readonly_fields = ['added_at']
