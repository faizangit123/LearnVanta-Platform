# Setup Notes

## PostgreSQL Setup Required

The backend is configured to use PostgreSQL. You have two options:

### Option 1: Install and Configure PostgreSQL (Recommended for Production)

1. **Install PostgreSQL**
   - Download from: https://www.postgresql.org/download/windows/
   - During installation, remember the password you set for the `postgres` user

2. **Create Database**

   ```bash
   # Open Command Prompt or PowerShell
   psql -U postgres

   # Enter your postgres password when prompted
   # Then create the database:
   CREATE DATABASE edustream;

   # Exit
   \q
   ```

3. **Update .env file**

   ```
   DB_NAME=edustream
   DB_USER=postgres
   DB_PASSWORD=your_postgres_password_here
   DB_HOST=localhost
   DB_PORT=5432
   ```

4. **Run Migrations**
   ```bash
   cd Django-backend
   .\venv\Scripts\activate
   python manage.py migrate
   ```

### Option 2: Use SQLite for Development (Easier Setup)

If you want to quickly test without PostgreSQL:

1. **Update settings.py** - Change the DATABASES configuration to:

   ```python
   DATABASES = {
       'default': {
           'ENGINE': 'django.db.backends.sqlite3',
           'NAME': BASE_DIR / 'db.sqlite3',
       }
   }
   ```

2. **Run Migrations**
   ```bash
   cd Django-backend
   .\venv\Scripts\activate
   python manage.py migrate
   ```

## Current Status

✅ Virtual environment created
✅ Dependencies installed
✅ Django project created
✅ All apps created (accounts, content, userdata, resources, activities)
✅ Models defined
✅ Serializers created
✅ Views created
✅ Admin panels configured
✅ Migrations generated

⏳ Pending: Database connection and migration application

## Next Steps After Database Setup

1. **Apply Migrations**

   ```bash
   python manage.py migrate
   ```

2. **Create Superuser**

   ```bash
   python manage.py createsuperuser
   ```

3. **Run Development Server**

   ```bash
   python manage.py runserver
   ```

4. **Access Admin Panel**
   - URL: http://localhost:8000/admin/
   - Use superuser credentials

5. **Test API Endpoints**
   - Base URL: http://localhost:8000/api/v1/
   - Auth endpoints: http://localhost:8000/api/v1/auth/
