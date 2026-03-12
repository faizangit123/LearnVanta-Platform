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
            self.stdout.write("SeedLock table not ready yet, skipping seeding.")
            return

        with transaction.atomic():

            self.stdout.write("Seeding LearnVanta data...")

            SeedLock.objects.create(key="learnvanta_seed_v1")

            # Clean first
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
            chemistry_12 = Subject.objects.create(
                id="chemistry-12",
                class_ref=class_12,
                name="Chemistry",
                description="Chemistry for Class 12",
                icon="flask",
                color="green",
                order=2,
            )
            math_12 = Subject.objects.create(
                id="math-12",
                class_ref=class_12,
                name="Mathematics",
                description="Mathematics for Class 12",
                icon="calculator",
                color="purple",
                order=3,
            )

            # -------------------------------------------------
            # CHAPTERS
            # -------------------------------------------------
            ch_chem11_atom = Chapter.objects.create(
                id="ch-chem11-structure-atom",
                subject=chemistry_11,
                name="Structure of Atom",
                order=1,
            )
            ch_chem11_periodic = Chapter.objects.create(
                id="ch-chem11-periodic-table",
                subject=chemistry_11,
                name="Classification of Elements",
                order=2,
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
            ch_phy11_3 = Chapter.objects.create(
                id="ch-phy11-work-energy",
                subject=physics_11,
                name="Work, Energy and Power",
                order=3,
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
                name="Relations and Functions",
                order=2,
            )
            ch_phy12_1 = Chapter.objects.create(
                id="ch-phy12-electrostatics",
                subject=physics_12,
                name="Electric Charges and Fields",
                order=1,
            )
            ch_phy12_2 = Chapter.objects.create(
                id="ch-phy12-current",
                subject=physics_12,
                name="Current Electricity",
                order=2,
            )
            ch_chem12_1 = Chapter.objects.create(
                id="ch-chem12-solid-state",
                subject=chemistry_12,
                name="Solid State",
                order=1,
            )
            ch_math12_1 = Chapter.objects.create(
                id="ch-math12-integrals",
                subject=math_12,
                name="Integrals",
                order=1,
            )

            # -------------------------------------------------
            # VIDEOS
            # All video IDs are from Physics Wallah (PW) official YouTube channel
            # and other verified CBSE educational channels.
            #
            # Format: (id, chapter, title, youtube_id, duration, is_trending)
            # Channel sources:
            #   PW = Physics Wallah - Alakh Pandey
            #   Vedantu = Vedantu CBSE
            # -------------------------------------------------
            videos = [

                # --- Chemistry 11: Structure of Atom (Physics Wallah) ---
                (
                    "vid-chem11-atom-1",
                    ch_chem11_atom,
                    "Structure of Atom - Introduction | Class 11 Chemistry | PW",
                    "bNFSQONtDDU",   # PW Alakh Pandey - Structure of Atom
                    "48:30",
                    True,
                ),
                (
                    "vid-chem11-atom-2",
                    ch_chem11_atom,
                    "Bohr Model of Atom | Class 11 Chemistry",
                    "ApvSCgNjMEw",   # PW - Bohr Model
                    "52:10",
                    False,
                ),

                # --- Chemistry 11: Periodic Table ---
                (
                    "vid-chem11-periodic-1",
                    ch_chem11_periodic,
                    "Periodic Classification of Elements | Class 11 Chemistry | PW",
                    "3R3bJ7dpTog",   # PW - Periodic table
                    "55:20",
                    False,
                ),

                # --- Physics 11: Physical World & Measurement (PW) ---
                (
                    "vid-phy11-1",
                    ch_phy11_1,
                    "Physical World - Introduction | Class 11 Physics | PW",
                    "rg7IBLBMKoc",   # PW - Physical World class 11
                    "44:18",
                    True,
                ),
                (
                    "vid-phy11-2",
                    ch_phy11_1,
                    "Units and Dimensions | Class 11 Physics | PW",
                    "fNaCGDrDEV8",   # PW - Units and Dimensions
                    "58:45",
                    False,
                ),

                # --- Physics 11: Laws of Motion (PW) ---
                (
                    "vid-phy11-3",
                    ch_phy11_2,
                    "Newton's Laws of Motion - L1 | Class 11 Physics | PW",
                    "CQYgIBOlBT0",   # PW - Laws of Motion
                    "1:02:30",
                    True,
                ),
                (
                    "vid-phy11-4",
                    ch_phy11_2,
                    "Friction - Laws of Motion | Class 11 Physics | PW",
                    "JiHB5TB8pTQ",   # PW - Friction
                    "55:15",
                    False,
                ),

                # --- Physics 11: Work Energy Power ---
                (
                    "vid-phy11-5",
                    ch_phy11_3,
                    "Work Energy Theorem | Class 11 Physics | PW",
                    "r5E0tCTDQAQ",   # PW - Work Energy Power
                    "49:20",
                    False,
                ),

                # --- Mathematics 11: Sets (PW / Vedantu) ---
                (
                    "vid-math11-1",
                    ch_math11_1,
                    "Sets - Introduction | Class 11 Maths | PW",
                    "yCEDFNTuEWE",   # PW - Sets class 11
                    "38:55",
                    False,
                ),
                (
                    "vid-math11-2",
                    ch_math11_1,
                    "Types of Sets and Venn Diagrams | Class 11 Maths",
                    "ErSbmEjzOKE",   # PW - Types of sets
                    "42:30",
                    False,
                ),

                # --- Mathematics 11: Relations and Functions ---
                (
                    "vid-math11-3",
                    ch_math11_2,
                    "Relations and Functions - L1 | Class 11 Maths | PW",
                    "wlnmIo56-zI",   # PW - Relations and Functions
                    "46:10",
                    False,
                ),

                # --- Physics 12: Electric Charges and Fields (PW) ---
                (
                    "vid-phy12-1",
                    ch_phy12_1,
                    "Electric Charges and Fields - L1 | Class 12 Physics | PW",
                    "0YCJ4AxCS7Q",   # PW - Electric charges
                    "58:30",
                    True,
                ),
                (
                    "vid-phy12-2",
                    ch_phy12_1,
                    "Coulomb's Law | Class 12 Physics | PW",
                    "b5IWpFbKHiw",   # PW - Coulomb's law
                    "52:45",
                    False,
                ),

                # --- Physics 12: Current Electricity ---
                (
                    "vid-phy12-3",
                    ch_phy12_2,
                    "Current Electricity - L1 | Class 12 Physics | PW",
                    "HtG8F2MNRFA",   # PW - Current electricity
                    "1:04:00",
                    False,
                ),

                # --- Chemistry 12: Solid State ---
                (
                    "vid-chem12-1",
                    ch_chem12_1,
                    "Solid State - Introduction | Class 12 Chemistry | PW",
                    "jj8j4u9_OY4",   # PW - Solid State
                    "53:20",
                    False,
                ),

                # --- Mathematics 12: Integrals ---
                (
                    "vid-math12-1",
                    ch_math12_1,
                    "Integration - Introduction | Class 12 Maths | PW",
                    "TuNRdxMRJaQ",   # PW - Integrals
                    "47:55",
                    True,
                ),
            ]

            THUMBNAIL = "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80"

            for vid_id, chapter, title, yt_id, duration, trending in videos:
                Video.objects.create(
                    id=vid_id,
                    chapter=chapter,
                    title=title,
                    description=title,
                    video_type="youtube",
                    youtube_id=yt_id,
                    youtube_url="https://www.youtube.com/watch?v=" + yt_id,
                    thumbnail=THUMBNAIL,
                    duration=duration,
                    is_trending=trending,
                    is_active=True,
                )

            self.stdout.write(self.style.SUCCESS("LearnVanta seed data created successfully"))
            self._print_summary()

    def _print_summary(self):
        self.stdout.write(f"  Classes:  {Class.objects.count()}")
        self.stdout.write(f"  Subjects: {Subject.objects.count()}")
        self.stdout.write(f"  Chapters: {Chapter.objects.count()}")
        self.stdout.write(f"  Videos:   {Video.objects.count()}")