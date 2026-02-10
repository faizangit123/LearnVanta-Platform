from django.core.management.base import BaseCommand
from django.db import transaction
from django.db.utils import ProgrammingError
from content.models import Class, Subject, Chapter, Video, SeedLock


class Command(BaseCommand):
    help = "Seed LearnVanta initial data (safe for Render & Docker)"

    def handle(self, *args, **kwargs):

        # -------------------------------------------------
        # PREVENT MULTIPLE EXECUTION 
        # -------------------------------------------------
        try:
            if SeedLock.objects.filter(key="learnvanta_seed_v1").exists():
                self.stdout.write("Seed already executed, skipping seeding.")
                self._print_summary()
                return
        except ProgrammingError:
            # SeedLock table not created yet (migrations still running)
            self.stdout.write("SeedLock table not ready yet, skipping seeding.")
            return

        with transaction.atomic():

            self.stdout.write("Seeding LearnVanta data...")

            # -------------------------------------------------
            # CREATE SEED LOCK FIRST
            # -------------------------------------------------
            SeedLock.objects.create(key="learnvanta_seed_v1")

            # -------------------------------------------------
            # CLEAN DATABASE (RUNS ONLY ONCE)
            # -------------------------------------------------
            Video.objects.all().delete()
            Chapter.objects.all().delete()
            Subject.objects.all().delete()
            Class.objects.all().delete()

            # -------------------------------------------------
            # CLASSES
            # -------------------------------------------------
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

            # -------------------------------------------------
            # SUBJECTS
            # -------------------------------------------------
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

            # -------------------------------------------------
            # CHAPTERS
            # -------------------------------------------------
            ch_chem11 = Chapter.objects.create(
                id="ch-chem11-structure-atom",
                subject=chemistry_11,
                name="Structure of Atom",
                order=1,
            )

            ch_phy11_1 = Chapter.objects.create(
                id="ch-phy11-physical-world",
                subject=physics_11,
                name="Physical World & Measurement",
                order=1,
            )

            ch_phy11_2 = Chapter.objects.create(
                id="ch-phy11-laws-motion",
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

            ch_phy12 = Chapter.objects.create(
                id="ch-phy12-electrostatics",
                subject=physics_12,
                name="Electrostatics",
                order=1,
            )

            # -------------------------------------------------
            # VIDEOS
            # -------------------------------------------------
            videos = [
                ("vid-chem11-1", ch_chem11, "Structure of Atom – Class 11 Chemistry", "YpX1R9J4XkQ", "19:50", False),
                ("vid-phy11-1", ch_phy11_1, "Introduction to Physics – Physical World", "E5kBJW5Z8gQ", "14:32", True),
                ("vid-phy11-2", ch_phy11_1, "Units and Measurements – Class 11 Physics", "HqjG1KJ7V9E", "18:10", False),
                ("vid-phy11-3", ch_phy11_2, "Newton’s First Law of Motion", "kKKM8Y-u7ds", "22:45", False),
                ("vid-math11-1", ch_math11_1, "Sets – Introduction (Class 11)", "z8VJ6Nf0sY0", "16:20", False),
                ("vid-math11-2", ch_math11_1, "Types of Sets – Mathematics", "ZpG7n9nJH0A", "19:40", False),
                ("vid-math11-3", ch_math11_2, "Functions – One to One & Onto", "9V6L7ZkU6pI", "21:55", False),
                ("vid-phy12-1", ch_phy12, "Electric Charges and Fields", "Kk7t2d4Jk8I", "24:30", True),
                ("vid-phy12-2", ch_phy12, "Coulomb’s Law – Electrostatics", "xP0u8l3x0aU", "20:15", False),
            ]

            for vid, chapter, title, yt, duration, trending in videos:
                Video.objects.create(
                    id=vid,
                    chapter=chapter,
                    title=title,
                    description=title,
                    video_type="youtube",
                    youtube_id=yt,
                    youtube_url=f"https://www.youtube.com/watch?v=uK1i6IzOhAA",
                    thumbnail=f"https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80",
                    duration=duration,
                    is_trending=trending,
                    is_active=True,
                )

            self.stdout.write(self.style.SUCCESS("LearnVanta seed data created successfully"))
            self._print_summary()

    # -------------------------------------------------
    # SUMMARY
    # -------------------------------------------------
    def _print_summary(self):
        self.stdout.write(f"Created {Class.objects.count()} classes")
        self.stdout.write(f"Created {Subject.objects.count()} subjects")
        self.stdout.write(f"Created {Chapter.objects.count()} chapters")
        self.stdout.write(f"Created {Video.objects.count()} videos")
