from django.db import migrations


def add_video_ordering_columns(apps, schema_editor):
    vendor = schema_editor.connection.vendor

    if vendor == "sqlite":
        # Get existing columns
        cursor = schema_editor.connection.cursor()
        cursor.execute("PRAGMA table_info(videos)")
        existing_columns = {row[1] for row in cursor.fetchall()}

        if "views" not in existing_columns:
            schema_editor.execute(
                "ALTER TABLE videos ADD COLUMN views INTEGER DEFAULT 0"
            )

        if "likes" not in existing_columns:
            schema_editor.execute(
                "ALTER TABLE videos ADD COLUMN likes INTEGER DEFAULT 0"
            )

        if "published_at" not in existing_columns:
            schema_editor.execute(
                "ALTER TABLE videos ADD COLUMN published_at DATETIME"
            )

    else:
        # PostgreSQL (Render)
        schema_editor.execute("""
            ALTER TABLE videos
            ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0
        """)
        schema_editor.execute("""
            ALTER TABLE videos
            ADD COLUMN IF NOT EXISTS likes INTEGER DEFAULT 0
        """)
        schema_editor.execute("""
            ALTER TABLE videos
            ADD COLUMN IF NOT EXISTS published_at TIMESTAMP
        """)


class Migration(migrations.Migration):

    dependencies = [
        ("content", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(add_video_ordering_columns),
    ]
