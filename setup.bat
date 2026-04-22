@echo off
REM Setup script for Prescription OCR Application (Windows)

echo 🚀 Setting up Prescription OCR Application...

REM Backend Setup
echo.
echo 📦 Setting up Backend...
cd backend

REM Create virtual environment
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
call venv\Scripts\activate.bat

REM Install dependencies
echo Installing Python dependencies...
pip install -r requirements.txt

REM Create uploads directory
if not exist "uploads" mkdir uploads

REM Check .env file
if not exist ".env" (
    echo Creating .env from .env.example...
    copy .env.example .env
    echo ⚠️  Please edit backend\.env and add your GROQ_API_KEY
)

cd ..

REM Frontend Setup
echo.
echo ⚛️  Setting up Frontend...
cd frontend

REM Install dependencies
echo Installing Node dependencies...
npm install

REM Check .env file
if not exist ".env" (
    echo Creating .env from .env.example...
    copy .env.example .env
)

cd ..

echo.
echo ✅ Setup completed!
echo.
echo 📝 Next steps:
echo 1. Edit backend\.env and add your GROQ_API_KEY
echo 2. Run: npm run dev (from frontend directory)
echo 3. Run: python backend/app.py (from project root)
echo 4. Open: http://localhost:5173 in your browser
