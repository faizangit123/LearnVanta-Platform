from django.contrib import admin
from .models import Resource


@admin.register(Resource)
class ResourceAdmin(admin.ModelAdmin):
    list_display = ['title', 'chapter', 'type', 'file_name', 'file_size', 'download_count', 'uploaded_at']
    list_filter = ['type', 'uploaded_at']
    search_fields = ['title', 'chapter__name', 'file_name']
    readonly_fields = ['uploaded_at', 'download_count']
