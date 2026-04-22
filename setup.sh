#!/bin/bash

# Setup script for Prescription OCR Application

echo "🚀 Setting up Prescription OCR Application..."

# Backend Setup
echo ""
echo "📦 Setting up Backend..."
cd backend

# Create virtual environment
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python -m venv venv
fi

# Activate virtual environment
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
    source venv/Scripts/activate
else
    source venv/bin/activate
fi

# Install dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

# Create uploads directory with .gitkeep
mkdir -p uploads
touch uploads/.gitkeep

# Check .env file
if [ ! -f ".env" ]; then
    echo "Creating .env from .env.example..."
    cp .env.example .env
    echo "⚠️  Please edit backend/.env and add your GROQ_API_KEY"
fi

cd ..

# Frontend Setup
echo ""
echo "⚛️  Setting up Frontend..."
cd frontend

# Install dependencies
echo "Installing Node dependencies..."
npm install

# Check .env file
if [ ! -f ".env" ]; then
    echo "Creating .env from .env.example..."
    cp .env.example .env
fi

cd ..

echo ""
echo "✅ Setup completed!"
echo ""
echo "📝 Next steps:"
echo "1. Edit backend/.env and add your GROQ_API_KEY"
echo "2. Run: npm run dev (from frontend directory)"
echo "3. Run: python backend/app.py (from project root)"
echo "4. Open: http://localhost:5173 in your browser"
