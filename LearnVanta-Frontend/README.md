# 🎓 LearnVanta – Modern Video Learning Platform

**LearnVanta** is a modern, video-based learning platform for **Class 8–12 students and college learners**.  
It curates and embeds **YouTube educational content** into a structured, distraction-free learning experience with progress tracking, notes, playlists, and admin controls.

The platform is built with a **React + Vite frontend** and a **Django REST backend**, designed to be scalable, secure, and production-ready.

---

## 🔗 Live Demo
- **Frontend:** https://learn-vanta-platform.vercel.app/  
- **Backend API:** https://your-backend.onrender.com  
- **Health Check:** `/api/health/`

---

### 📸 Screenshots

- Add screenshots here

- Home page

- Video player

- Notes & playlists

- Admin dashboard

---

## 🏗️ Project Architecture

```bash
FULL-STACK/
├── Django-backend/ # Django REST API
│ ├── accounts/
│ ├── content/
│ ├── resources/
│ ├── activities/
│ ├── edustream_backend/
│ └── manage.py
│
├── EadStream-Frontend/ # React + Vite frontend
│ ├── src/
│ ├── public/
│ ├── vite.config.js
│ └── package.json
│
└── .github/workflows/ # CI pipelines
```

---

## ✨ Features

### 📖 Learning Experience
- **Structured Curriculum**: Class → Subject → Chapter → Video
- **Embedded Video Lessons** (YouTube)
- **Continue Watching** (resume from last timestamp)
- **Watch History** with progress tracking

### 🔖 Personalization
- **Favorites / Bookmarks**
- **Custom Playlists**
- **Personal Notes per Video / Chapter**
- **Dark & Light Mode**

### 🔍 Discovery
- **Smart Search**
- **Filter by Class / Subject / Chapter**
- **Related & Recommended Content**

### 👤 User Features
- Authentication (Login / Register)
- User profile & preferences
- Progress tracking

### 🛠️ Admin Dashboard
- Manage classes, subjects, chapters, videos
- Upload PDFs, notes, and resources
- User & content moderation

---

## 🚀 Tech Stack

### Frontend
- **React 18**
- **Vite**
- **React Router v6**
- **Tailwind CSS / Custom CSS**
- **Lucide React Icons**

### Backend
- **Django**
- **Django REST Framework**
- **PostgreSQL**
- **JWT / Token Authentication**
- **Whitenoise** (static files)

### DevOps & Deployment
- **Docker** (local development)
- **GitHub Actions** (CI)
- **Vercel** (Frontend hosting)
- **Render** (Backend & Database)
- **HTTPS by default**

---

## 📦 Local Development Setup

### 1️⃣ Clone Repository
```bash
git clone https://github.com/your-username/learnvanta.git
cd learnvanta
```

### 2️⃣ Frontend Setup
```bash
cd EadStream-Frontend
npm install
npm run dev
```


**Frontend runs at:**
```bash
http://localhost:5173
```

### 3️⃣ Backend Setup (Docker – Recommended)
```bash
cd Django-backend
docker-compose up --build
```

**Backend runs at:**
```bash
http://localhost:8000
```

### 🌍 Environment Variables
- Frontend (Vercel / Local)
- VITE_API_BASE_URL=https://your-backend.onrender.com

**Backend (Render)**
```bash
SECRET_KEY=your-secret-key
DEBUG=False
DATABASE_URL=postgres://user:password@host:5432/dbname
ALLOWED_HOSTS=your-backend.onrender.com
FRONTEND_URL=https://your-project.vercel.app
```

### 🔄 CI/CD Pipeline
- Continuous Integration (GitHub Actions)

- Frontend: lint, type-check, build

- Backend: lint, migrations check, tests

**Continuous Deployment**

- Frontend: Auto-deployed on Vercel (GitHub integration)

- Backend: Auto-deployed on Render (GitHub integration)

- No manual deployment or servers required.

### 🔐 Security & Best Practices

- HTTPS enforced (Vercel & Render)

**Environment-based settings**

- Production-safe Django configuration

- CORS properly configured

- Health check endpoint for monitoring


### 🧭 Roadmap

- ✅ Video progress tracking

- ✅ Notes & playlists

- 🔜 Practice questions

- 🔜 PDF / Formula sheets

- 🔜 Recommendation engine

- 🔜 Mobile-first UI improvements

### 🤝 Contributing

**Contributions are welcome!**

- Fork the repo

- Create a feature branch

- Commit your changes

- Open a Pull Request

### 📄 License

- This project is licensed under the MIT License.

### 🙌 Acknowledgements

- YouTube (embedded educational content)

- Open-source community

- React & Django ecosystems

### ⭐ If you like this project

**Give it a star ⭐ and share feedback!**

---
