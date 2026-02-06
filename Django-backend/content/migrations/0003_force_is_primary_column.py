from django.db import migrations

class Migration(migrations.Migration):

    dependencies = [
        ('content', '0002_playlist_updated_at_subject_is_primary_and_more'),
    ]

    operations = [
        migrations.RunSQL(
            sql="""
            ALTER TABLE subjects
            ADD COLUMN IF NOT EXISTS is_primary BOOLEAN DEFAULT FALSE;
            """,
            reverse_sql="""
            ALTER TABLE subjects
            DROP COLUMN IF EXISTS is_primary;
            """
        ),
    ]
