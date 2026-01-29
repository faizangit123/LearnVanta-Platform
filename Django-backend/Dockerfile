# EduStream Django Backend
FROM python:3.11-slim

# -----------------------------
# Environment variables
# -----------------------------
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# -----------------------------
# Working directory
# -----------------------------
WORKDIR /app

# -----------------------------
# System dependencies
# -----------------------------
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# -----------------------------
# Python dependencies
# -----------------------------
COPY requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt

# -----------------------------
# Copy project files
# -----------------------------
COPY . .

# -----------------------------
# Static & media directories
# -----------------------------
RUN mkdir -p /app/staticfiles /app/media

# -----------------------------
# Collect static files (safe at build time)
# -----------------------------
ENV COLLECTSTATIC=1
RUN python manage.py collectstatic --noinput

# -----------------------------
# Start server (Render-compatible)
# -----------------------------
CMD sh -c "\
    python manage.py migrate && \
    gunicorn edustream_backend.wsgi:application \
    --bind 0.0.0.0:${PORT:-8000} \
    --workers 2 \
    --timeout 120 \
"
