from django.core.management.base import BaseCommand
from content.models import Class, Subject, Chapter, Video


class Command(BaseCommand):
    help = 'Seed initial data for classes, subjects, chapters, and videos'

    def handle(self, *args, **kwargs):
        # Prevent duplicate seeding
        if Class.objects.exists():
            self.stdout.write("Data already exists, skipping seeding.")
            return

        self.stdout.write('Seeding data...')

        # Create Classes
        class_11, _ = Class.objects.get_or_create(
            id='class-11',
            defaults={
                'name': 'Class 11',
                'description': 'Grade 11 courses',
                'icon': 'book',
                'order': 1
            }
        )

        class_12, _ = Class.objects.get_or_create(
            id='class-12',
            defaults={
                'name': 'Class 12',
                'description': 'Grade 12 courses',
                'icon': 'book',
                'order': 2
            }
        )

        # Subjects
        physics_11, _ = Subject.objects.get_or_create(
            id='physics-11',
            defaults={
                'class_ref': class_11,
                'name': 'Physics',
                'description': 'Physics for Class 11',
                'icon': 'atom',
                'color': 'blue',
                'order': 1
            }
        )

        chemistry_11, _ = Subject.objects.get_or_create(
            id='chemistry-11',
            defaults={
                'class_ref': class_11,
                'name': 'Chemistry',
                'description': 'Chemistry for Class 11',
                'icon': 'flask',
                'color': 'green',
                'order': 2
            }
        )

        math_11, _ = Subject.objects.get_or_create(
            id='math-11',
            defaults={
                'class_ref': class_11,
                'name': 'Mathematics',
                'description': 'Mathematics for Class 11',
                'icon': 'calculator',
                'color': 'purple',
                'order': 3
            }
        )

        physics_12, _ = Subject.objects.get_or_create(
            id='physics-12',
            defaults={
                'class_ref': class_12,
                'name': 'Physics',
                'description': 'Physics for Class 12',
                'icon': 'atom',
                'color': 'blue',
                'order': 1
            }
        )

        chemistry_12, _ = Subject.objects.get_or_create(
            id='chemistry-12',
            defaults={
                'class_ref': class_12,
                'name': 'Chemistry',
                'description': 'Chemistry for Class 12',
                'icon': 'flask',
                'color': 'green',
                'order': 2
            }
        )

        math_12, _ = Subject.objects.get_or_create(
            id='math-12',
            defaults={
                'class_ref': class_12,
                'name': 'Mathematics',
                'description': 'Mathematics for Class 12',
                'icon': 'calculator',
                'color': 'purple',
                'order': 3
            }
        )

        # Chapters
        ch1_physics_11, _ = Chapter.objects.get_or_create(
            id='ch-1-physics-11',
            defaults={
                'subject': physics_11,
                'name': 'Physical World',
                'description': 'Introduction to Physics',
                'order': 1
            }
        )

        ch2_physics_11, _ = Chapter.objects.get_or_create(
            id='ch-2-physics-11',
            defaults={
                'subject': physics_11,
                'name': 'Units and Measurements',
                'description': 'Understanding units and measurements',
                'order': 2
            }
        )

        # Videos
        Video.objects.get_or_create(
            id='vid-1-physics-11',
            defaults={
                'chapter': ch1_physics_11,
                'title': 'Introduction to Physical World',
                'description': 'Learn about the physical world and scope of physics',
                'video_type': 'youtube',
                'youtube_id': 'dQw4w9WgXcQ',
                'youtube_url': 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'thumbnail': 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
                'duration': '15:30',
                'order': 1,
                'is_trending': True
            }
        )

        Video.objects.get_or_create(
            id='vid-2-physics-11',
            defaults={
                'chapter': ch2_physics_11,
                'title': 'Understanding SI Units',
                'description': 'Learn about SI units and their importance',
                'video_type': 'youtube',
                'youtube_id': 'dQw4w9WgXcQ',
                'youtube_url': 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'thumbnail': 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
                'duration': '20:45',
                'order': 1
            }
        )

        self.stdout.write(self.style.SUCCESS('Successfully seeded data!'))
        self.stdout.write(f'Created {Class.objects.count()} classes')
        self.stdout.write(f'Created {Subject.objects.count()} subjects')
        self.stdout.write(f'Created {Chapter.objects.count()} chapters')
        self.stdout.write(f'Created {Video.objects.count()} videos')
