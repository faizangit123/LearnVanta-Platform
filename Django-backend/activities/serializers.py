from rest_framework import serializers
from .models import ActivityLog


class ActivityLogSerializer(serializers.ModelSerializer):
    type_label = serializers.CharField(source="get_type_display", read_only=True)

    class Meta:
        model = ActivityLog
        fields = [
            'id',
            'user',
            'type',
            'type_label',
            'details',
            'timestamp'
        ]
        read_only_fields = ['id', 'timestamp']
        extra_kwargs = {
            "user": {"required": False},
        }

