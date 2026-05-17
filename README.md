# LearnVanta – Modern Video Learning Platform

**LearnVanta** is a modern, video-based learning platform designed for **Class 8–12 students and college learners**.  
It organizes **YouTube educational content** into a structured, distraction-free learning experience with features like progress tracking, notes, playlists, and admin content management.

The platform is built using a **React + Vite frontend** and a **Django REST Framework backend**, designed to be **scalable, secure, and production-ready**.

---

## 🌐 Live Demo

| Service | URL |
|---------|-----|
| **Frontend** | https://skill-sync-sage-nu.vercel.app/ |
| **Backend API:** | https://your-backend.onrender.com |
| **Health Check:** | `/api/health/` |

---

# 📸 Screenshots


---

# 🏗️ Project Architecture
```bash
FULL-STACK/
├── Django-backend/ # Django REST API
│ ├── accounts/
│ ├── content/
│ ├── userdata/
│ ├── resources/
│ ├── activities/
│ ├── edustream_backend/
│ └── manage.py
│
├── LearnVanta-Frontend/ # React + Vite frontend
│ ├── src/
│ ├── public/
│ ├── vite.config.js
│ └── package.json
│
└── .github/workflows/ # CI pipelines
```

---


---

# ✨ Features

## 📖 Learning Experience

- Structured curriculum: **Class → Subject → Chapter → Video**
- Embedded **YouTube video lessons**
- **Continue Watching** feature (resume from last timestamp)
- **Watch history** with progress tracking

## 🔖 Personalization

- Favorites / Bookmarks
- Custom playlists
- Personal notes for videos or chapters
- Dark & Light mode

## 🔍 Discovery

- Smart search
- Filter by **Class / Subject / Chapter**
- Related and recommended content

## 👤 User Features

- User authentication (Register / Login)
- Email verification
- User profile management
- Learning progress tracking

## 🛠️ Admin Dashboard

- Manage classes, subjects, chapters, and videos
- Upload PDFs and learning resources
- User and content moderation
- Activity monitoring

---

# 🚀 Tech Stack

## Frontend

- React 18
- Vite
- React Router v6
- Tailwind CSS / Custom CSS
- Lucide React Icons

## Backend

- Django
- Django REST Framework
- PostgreSQL
- JWT / Token Authentication
- Whitenoise (static file handling)

## DevOps & Deployment

- Docker (for local backend development)
- GitHub Actions (CI pipeline)
- Vercel (Frontend hosting)
- Render (Backend hosting + PostgreSQL database)
- HTTPS enabled by default

---

# 📂 Full Project Structure
```bash
Django-backend/
├── accounts/ # User authentication & profiles
├── content/ # Classes, Subjects, Chapters, Videos
├── userdata/ # Watch History, Favorites, Notes, Playlists
├── resources/ # PDF resources
├── activities/ # Activity logging
├── edustream_backend/ # Main Django project
├── media/ # Uploaded files
├── manage.py
├── requirements.txt
└── .env

LearnVanta-Frontend/
├── src/
├── public/
├── package.json
├── vite.config.js
└── index.html
```
---

# 📦 Local Development Setup

## 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/learnvanta.git
cd learnvanta
```

### 🖥️ Frontend Setup
```bash
cd LearnVanta-Frontend
npm install
npm run dev
```

# Frontend runs at:
```bash
http://localhost:5173
```
# ⚙️ Backend Setup
- Option 1 — Using Docker (Recommended)
```bash
cd Django-backend
docker-compose up --build
```

# Backend runs at:
```bash
http://localhost:8000
```
- Option 2 — Manual Setup
- Create Virtual Environment
```bash
python -m venv venv
```

# Windows
```bash
- -venv\Scripts\activate.ps1
```

# Linux / Mac
```bash
source venv/bin/activate
```
- Install Dependencies
```bash
pip install -r requirements.txt
```
### 🗄️ Database Setup (PostgreSQL)

- Login to PostgreSQL:
```bash
psql -U postgres
```

- Create database:

### CREATE DATABASE edustream;

- Exit:
```bash
\q
```
- 🔧 Configure Environment Variables

# Copy the example file:
```bash
cp .env.example .env
```
Update .env:
```bash
SECRET_KEY=your-secret-key
DEBUG=False
DB_NAME=edustream
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DATABASE_URL=postgres://user:password@host:5432/dbname
ALLOWED_HOSTS=your-backend.onrender.com
FRONTEND_URL=https://your-project.vercel.app
EMAIL_HOST_USER=your_email
EMAIL_HOST_PASSWORD=your_email_password
```

### 🔄 Run Migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

### 👤 Create Admin User
```bash
python manage.py createsuperuser
```
### ▶️ Start Backend Server
```bash
python manage.py runserver
```

### API runs at:

- http://localhost:8000

### 🔌 API Endpoints
# Authentication
- POST /api/v1/auth/login/
- POST /api/v1/auth/register/
- POST /api/v1/auth/logout/
- GET  /api/v1/auth/profile/
- PATCH /api/v1/auth/profile/
- POST /api/v1/auth/verify-email/
- POST /api/v1/auth/resend-verification/
- POST /api/v1/auth/password-reset/
- POST /api/v1/auth/password-reset/confirm/
# 🛠 Admin Panel

### Access Django admin panel:

- http://localhost:8000/admin/

- Login using the superuser credentials created earlier.

## 🔗 Frontend Integration

- Set frontend environment variables:
 
 - VITE_API_BASE_URL=http://localhost:8000
 - VITE_USE_MOCK=false

# Start backend server:
```bash
python manage.py runserver
```
- Then start frontend:
```bash
npm run dev
```
### 🔄 CI/CD Pipeline
- Continuous Integration

# GitHub Actions automatically runs:

 - Frontend linting

 - Frontend build checks
 
 - Backend migrations check

 - Backend tests

## Continuous Deployment

 - Frontend: Auto-deploys via Vercel GitHub integration

 - Backend: Auto-deploys via Render GitHub integration

 - No manual deployment required.

## 🔐 Security & Best Practices

 - HTTPS enforced by Vercel and Render

 - Environment-based Django configuration

 - Secure secret key handling

 - Proper CORS configuration

 - Health check endpoint for uptime monitoring

### 🚀 Production Deployment

 - Steps for production backend deployment:

 - Set DEBUG=False

 - Update ALLOWED_HOSTS
 
 - Configure PostgreSQL production database

 - Configure email backend

 - Use Gunicorn as WSGI server

 - Use Nginx as reverse proxy

 - Configure SSL/TLS certificates

## 🧪 Development Commands

 - Create migrations:
```bash
  python manage.py makemigrations
```
 - Apply migrations:
```bash
  python manage.py migrate
```
 - Run tests:
```bash
  python manage.py test
```
 - Create a new Django app:
```bash
  python manage.py startapp app_name
```  
### 🧰 Troubleshooting
 - Database Connection Error

 - Make sure PostgreSQL is running and credentials are correct.
 
# Check PostgreSQL status (Windows):
```bash
pg_ctl status
```
- Start PostgreSQL:
```bash
pg_ctl start
```
 - Migration Errors

 - Delete migration files (except __init__.py) and recreate:
```bash
python manage.py makemigrations
python manage.py migrate
Import Errors
```

 - Ensure the virtual environment is activated:
```bash
pip install -r requirements.txt
```
### 🧭 Roadmap

 - ✅ Video progress tracking

 - ✅ Notes and playlists

 - 🔜 Practice questions

 - 🔜 PDF / formula sheets

 - 🔜 Recommendation engine

 - 🔜 Mobile-first UI improvements


### 🙌 Acknowledgements

 - YouTube for embedded educational content

 - Open-source community

 - React ecosystem

 - Django ecosystem

### ⭐ Support

 - If you like this project, please give it a star ⭐ on GitHub and share feedback.
