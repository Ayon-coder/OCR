# Quick Start Guide - Prescription OCR

## 🚀 Running the Application

### Option 1: Automatic Setup (Recommended)

**Windows:**
```bash
setup.bat
```

**Mac/Linux:**
```bash
bash setup.sh
```

### Option 2: Manual Setup

#### Backend Setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Mac/Linux
pip install -r requirements.txt
```

Update `backend/.env` with your Groq API key.

#### Frontend Setup
```bash
cd frontend
npm install
```

### Running the Application

**Terminal 1 - Backend:**
```bash
cd backend
venv\Scripts\activate  # Windows
python app.py
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Visit `http://localhost:5173` in your browser.

## 🔑 Getting Your Groq API Key

1. Go to https://console.groq.com
2. Sign up or login
3. Create an API key
4. Copy the key to `backend/.env`:
   ```
   GROQ_API_KEY=gsk_xxxxxxxxxxxxx
   ```

## 📸 Testing

### Test with Sample Image
Place a prescription image in `backend/uploads/` and run:
```bash
cd backend
python test_pipeline.py
```

### Test API
```bash
curl -X POST -F "file=@prescription.jpg" http://localhost:5000/upload
```

## 🆘 Troubleshooting

### Port Already in Use
Change port in `backend/.env`:
```
FLASK_PORT=5001
```

### Module Not Found
```bash
pip install -r requirements.txt
npm install
```

### API Connection Error
Check that backend is running:
```bash
curl http://localhost:5000/health
```

## 📚 Documentation

- See `README.md` for full documentation
- API endpoints: See "API Endpoints" section in README.md
- Architecture: See "Project Structure" section in README.md

---

For more help, check the README.md file or open an issue.
