from django.core.management.base import BaseCommand
from content.models import Class, Subject, Chapter, Video


class Command(BaseCommand):
    help = "Seed initial data for LearnVanta"

    def handle(self, *args, **kwargs):
        # Prevent duplicate seeding
        if Class.objects.exists():
            self.stdout.write("Data already exists, skipping seeding.")
            return

        self.stdout.write("Seeding LearnVanta data...")

        # =====================
        # CLASSES
        # =====================
        class_11 = Class.objects.create(
            id="class-11",
            name="Class 11",
            description="CBSE Class 11",
            icon="book",
            order=1,
        )

        class_12 = Class.objects.create(
            id="class-12",
            name="Class 12",
            description="CBSE Class 12",
            icon="book",
            order=2,
        )

        # =====================
        # SUBJECTS
        # =====================
        physics_11 = Subject.objects.create(
            id="physics-11",
            class_ref=class_11,
            name="Physics",
            description="Physics for Class 11",
            icon="atom",
            color="blue",
            order=1,
        )

        chemistry_11 = Subject.objects.create(
            id="chemistry-11",
            class_ref=class_11,
            name="Chemistry",
            description="Chemistry for Class 11",
            icon="flask",
            color="green",
            order=2,
        )

        math_11 = Subject.objects.create(
            id="math-11",
            class_ref=class_11,
            name="Mathematics",
            description="Mathematics for Class 11",
            icon="calculator",
            color="purple",
            order=3,
        )

        physics_12 = Subject.objects.create(
            id="physics-12",
            class_ref=class_12,
            name="Physics",
            description="Physics for Class 12",
            icon="atom",
            color="blue",
            order=1,
        )

        # =====================
        # CHAPTERS
        # =====================
        ch_phy11_1 = Chapter.objects.create(
            id="ch-phy11-physical-world",
            subject=physics_11,
            name="Physical World & Measurement",
            order=1,
        )

        ch_phy11_2 = Chapter.objects.create(
            id="ch-phy11-motion",
            subject=physics_11,
            name="Laws of Motion",
            order=2,
        )

        ch_math11_1 = Chapter.objects.create(
            id="ch-math11-sets",
            subject=math_11,
            name="Sets",
            order=1,
        )

        ch_math11_2 = Chapter.objects.create(
            id="ch-math11-functions",
            subject=math_11,
            name="Functions",
            order=2,
        )

        ch_phy12_1 = Chapter.objects.create(
            id="ch-phy12-electrostatics",
            subject=physics_12,
            name="Electrostatics",
            order=1,
        )

        # =====================
        # VIDEOS (REAL YOUTUBE LINKS)
        # =====================
        videos = [
            {
                "id": "vid-phy11-1",
                "chapter": ch_phy11_1,
                "title": "Introduction to Physics – Physical World",
                "youtube_id": "E5kBJW5Z8gQ",
                "duration": "14:32",
                "is_trending": True,
            },
            {
                "id": "vid-phy11-2",
                "chapter": ch_phy11_1,
                "title": "Units and Measurements – Class 11 Physics",
                "youtube_id": "HqjG1KJ7V9E",
                "duration": "18:10",
            },
            {
                "id": "vid-phy11-3",
                "chapter": ch_phy11_2,
                "title": "Newton’s First Law of Motion",
                "youtube_id": "kKKM8Y-u7ds",
                "duration": "22:45",
            },
            {
                "id": "vid-math11-1",
                "chapter": ch_math11_1,
                "title": "Sets – Introduction (Class 11)",
                "youtube_id": "z8VJ6Nf0sY0",
                "duration": "16:20",
            },
            {
                "id": "vid-math11-2",
                "chapter": ch_math11_1,
                "title": "Types of Sets – Mathematics",
                "youtube_id": "ZpG7n9nJH0A",
                "duration": "19:40",
            },
            {
                "id": "vid-math11-3",
                "chapter": ch_math11_2,
                "title": "Functions – One to One & Onto",
                "youtube_id": "9V6L7ZkU6pI",
                "duration": "21:55",
            },
            {
                "id": "vid-phy12-1",
                "chapter": ch_phy12_1,
                "title": "Electric Charges and Fields",
                "youtube_id": "Kk7t2d4Jk8I",
                "duration": "24:30",
                "is_trending": True,
            },
            {
                "id": "vid-phy12-2",
                "chapter": ch_phy12_1,
                "title": "Coulomb’s Law – Electrostatics",
                "youtube_id": "xP0u8l3x0aU",
                "duration": "20:15",
            },
        ]

        for v in videos:
            Video.objects.create(
                id=v["id"],
                chapter=v["chapter"],
                title=v["title"],
                description=v["title"],
                video_type="youtube",
                youtube_id=v["youtube_id"],
                youtube_url=f"https://www.youtube.com/watch?v={v['youtube_id']}",
                thumbnail=f"https://img.youtube.com/vi/{v['youtube_id']}/maxresdefault.jpg",
                duration=v["duration"],
                is_trending=v.get("is_trending", False),
                is_active=True,
            )

        # =====================
        # SUMMARY OUTPUT
        # =====================
        self.stdout.write(self.style.SUCCESS("LearnVanta seed data created successfully"))
        self.stdout.write(f"Created {Class.objects.count()} classes")
        self.stdout.write(f"Created {Subject.objects.count()} subjects")
        self.stdout.write(f"Created {Chapter.objects.count()} chapters")
        self.stdout.write(f"Created {Video.objects.count()} videos")
