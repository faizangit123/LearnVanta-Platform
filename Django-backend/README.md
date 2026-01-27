# EduStream Django Backend

Django REST API backend for the EduStream video learning platform.

## Features

- User authentication with email verification
- Role-based access control (Admin, User)
- Video content management (Classes → Subjects → Chapters → Videos)
- User features: Watch History, Favorites, Notes, Playlists
- Resource management (PDF downloads for chapters)
- Activity logging for admin dashboard

## Prerequisites

- Python 3.10+
- PostgreSQL 14+
- pip or pipenv

## Setup Instructions

### 1. Create Virtual Environment

```bash
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment Variables

Copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

Update the following in `.env`:

- `SECRET_KEY`: Generate a new secret key for production
- `DB_NAME`, `DB_USER`, `DB_PASSWORD`: Your PostgreSQL credentials
- `EMAIL_HOST_USER`, `EMAIL_HOST_PASSWORD`: For email verification (optional)

### 4. Create PostgreSQL Database

```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE edustream;

# Exit
\q
```

### 5. Run Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

### 6. Create Superuser

```bash
python manage.py createsuperuser
```

Follow the prompts to create an admin account.

### 7. Run Development Server

```bash
python manage.py runserver
```

The API will be available at `http://localhost:8000`

## API Endpoints

### Authentication

- `POST /api/v1/auth/login/` - Login
- `POST /api/v1/auth/register/` - Register
- `POST /api/v1/auth/logout/` - Logout
- `GET /api/v1/auth/profile/` - Get profile
- `PATCH /api/v1/auth/profile/` - Update profile
- `POST /api/v1/auth/verify-email/` - Verify email
- `POST /api/v1/auth/resend-verification/` - Resend verification
- `POST /api/v1/auth/password-reset/` - Request password reset
- `POST /api/v1/auth/password-reset/confirm/` - Confirm password reset

## Admin Panel

Access the admin panel at `http://localhost:8000/admin/`

Use the superuser credentials you created.

## Frontend Integration

1. Set environment variables in your frontend `.env`:

   ```
   VITE_API_BASE_URL=http://localhost:8000
   VITE_USE_MOCK=false
   ```

2. Start the Django backend:

   ```bash
   python manage.py runserver
   ```

3. Start your frontend development server

## Project Structure

```
Django-backend/
├── accounts/           # User authentication & profiles
├── content/            # Classes, Subjects, Chapters, Videos
├── userdata/           # History, Favorites, Notes, Playlists
├── resources/          # PDF resources
├── activities/         # Activity logging
├── edustream_backend/  # Main project settings
├── media/              # Uploaded files
├── manage.py           # Django management script
├── requirements.txt    # Python dependencies
└── .env               # Environment variables
```

## Development

### Create Migrations

```bash
python manage.py makemigrations
```

### Apply Migrations

```bash
python manage.py migrate
```

### Create App

```bash
python manage.py startapp app_name
```

### Run Tests

```bash
python manage.py test
```

## Production Deployment

1. Set `DEBUG=False` in `.env`
2. Update `ALLOWED_HOSTS` with your domain
3. Configure PostgreSQL for production
4. Set up proper email backend
5. Use gunicorn as WSGI server
6. Set up nginx as reverse proxy
7. Configure SSL/TLS certificates

See `BACKEND_README.md` for complete deployment instructions.

## Troubleshooting

### Database Connection Error

Make sure PostgreSQL is running and credentials in `.env` are correct.

```bash
# Check PostgreSQL status (Windows)
pg_ctl status

# Start PostgreSQL (Windows)
pg_ctl start
```

### Migration Errors

Delete migration files (except `__init__.py`) and recreate:

```bash
python manage.py makemigrations
python manage.py migrate
```

### Import Errors

Make sure virtual environment is activated and dependencies are installed:

```bash
pip install -r requirements.txt
```

## License

MIT License

## Support

For issues and questions, please refer to `BACKEND_README.md` for detailed documentation.
