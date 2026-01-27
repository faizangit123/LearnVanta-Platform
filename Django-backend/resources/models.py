from django.db import models
from django.conf import settings
import uuid


class Resource(models.Model):
    """Chapter resources (PDFs)"""
    class ResourceType(models.TextChoices):
        NOTES = 'notes', 'Chapter Notes'
        PRACTICE = 'practice', 'Practice Questions'
        FORMULAS = 'formulas', 'Formula Sheet'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    chapter = models.ForeignKey('content.Chapter', on_delete=models.CASCADE, related_name='resources')
    type = models.CharField(max_length=20, choices=ResourceType.choices)
    title = models.CharField(max_length=200)
    file = models.FileField(upload_to='resources/')
    file_name = models.CharField(max_length=255)
    file_size = models.IntegerField()
    mime_type = models.CharField(max_length=100, default='application/pdf')
    download_count = models.IntegerField(default=0)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True
    )

    class Meta:
        db_table = 'resources'
        unique_together = ['chapter', 'type']

    def __str__(self):
        return f"{self.title} - {self.chapter.name}"
