from django.contrib import admin
from .models import ActivityLog


@admin.register(ActivityLog)
class ActivityLogAdmin(admin.ModelAdmin):
    list_display = ['type', 'timestamp', 'get_details_summary']
    list_filter = ['type', 'timestamp']
    search_fields = ['type', 'details']
    readonly_fields = ['timestamp']
    
    def get_details_summary(self, obj):
        """Display a summary of the details JSON"""
        if obj.details:
            return str(obj.details)[:50] + '...' if len(str(obj.details)) > 50 else str(obj.details)
        return '-'
    get_details_summary.short_description = 'Details'
