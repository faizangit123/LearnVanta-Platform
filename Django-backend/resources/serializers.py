from rest_framework import serializers
from .models import Resource


class ResourceSerializer(serializers.ModelSerializer):
    size = serializers.SerializerMethodField()
    file_url = serializers.SerializerMethodField()  

    class Meta:
        model = Resource
        fields = [
            'id',
            'chapter',
            'type',
            'title',
            'file_name',
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
