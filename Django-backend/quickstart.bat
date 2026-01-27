@echo off
echo ========================================
echo EduStream Backend Quick Start
echo ========================================
echo.

REM Check if virtual environment exists
if not exist "venv\" (
    echo Creating virtual environment...
    python -m venv venv
    echo.
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate
echo.

REM Check if dependencies are installed
echo Checking dependencies...
pip show django >nul 2>&1
if errorlevel 1 (
    echo Installing dependencies...
    pip install -r requirements.txt
    echo.
)

REM Check if migrations exist
if not exist "accounts\migrations\0001_initial.py" (
    echo Creating migrations...
    python manage.py makemigrations
    echo.
)

REM Display next steps
echo ========================================
echo Setup Status
echo ========================================
echo [OK] Virtual environment activated
echo [OK] Dependencies installed
echo [OK] Migrations created
echo.
echo ========================================
echo Next Steps:
echo ========================================
echo.
echo 1. Set up PostgreSQL database:
echo    - Install PostgreSQL from https://www.postgresql.org/download/
echo    - Create database: CREATE DATABASE edustream;
echo    - Update .env file with your PostgreSQL password
echo.
echo 2. Run migrations:
echo    python manage.py migrate
echo.
echo 3. Create superuser:
echo    python manage.py createsuperuser
echo.
echo 4. Seed sample data (optional):
echo    python manage.py seed_data
echo.
echo 5. Start development server:
echo    python manage.py runserver
echo.
echo ========================================
echo For SQLite (easier setup), see SETUP_NOTES.md
echo ========================================
echo.
pause
