from rest_framework import serializers
from .models import ActivityLog


class ActivityLogSerializer(serializers.ModelSerializer):
    type_label = serializers.CharField(source="get_type_display", read_only=True)

    class Meta:
        model = ActivityLog
        fields = [
            'id',
            'type',
            'type_label',   
            'details',
            'timestamp'
        ]
