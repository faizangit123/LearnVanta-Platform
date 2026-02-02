from rest_framework import serializers
from .models import Resource


class ResourceSerializer(serializers.ModelSerializer):
    size = serializers.SerializerMethodField()
    file_url = serializers.SerializerMethodField()
    file_name = serializers.SerializerMethodField()
    chapter_id = serializers.CharField(source="chapter.id", read_only=True)  # 🔧 added

    class Meta:
        model = Resource
        fields = [
            'id',
            'chapter',        # original (keep)
            'chapter_id',     # 🔧 frontend-safe
            'type',
            'title',
            'file_name',      # 🔧 fixed
            'file_url',
            'size',
            'mime_type',
            'download_count',
            'uploaded_at'
        ]
        read_only_fields = ['id', 'uploaded_at', 'download_count']

    def get_size(self, obj):
        if obj.file_size == 0:
            return '0 Bytes'
        sizes = ['Bytes', 'KB', 'MB', 'GB']
        k = 1024
        i = 0
        size = obj.file_size
        while size >= k and i < len(sizes) - 1:
            size /= k
            i += 1
        return f"{size:.1f} {sizes[i]}"

    def get_file_url(self, obj):
        request = self.context.get('request')
        if obj.file:
            if request:
                return request.build_absolute_uri(obj.file.url)
            return obj.file.url
        return None

    def get_file_name(self, obj):
        return obj.file.name.split("/")[-1] if obj.file else None
