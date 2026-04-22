# Prescription OCR Application

A full-stack web application that converts handwritten doctor prescriptions into clean, readable structured text using AI and OCR technology.

## 🚀 Features

- **Drag & Drop Image Upload** - Easy prescription image upload with preview
- **PaddleOCR Processing** - Advanced optical character recognition for accurate text extraction
- **Groq LLM Cleaning** - AI-powered text cleaning and medicine name correction
- **Structured JSON Output** - Organized prescription data with medicine names, dosages, and schedules
- **PDF Download** - Export cleaned prescriptions as professional PDF documents
- **Copy to Clipboard** - Quick copy functionality for medicines and raw text
- **Dark Mode** - Comfortable viewing in low-light environments
- **Processing History** - Keep track of recently processed prescriptions
- **Responsive Design** - Works seamlessly on desktop and mobile devices
- **Error Handling** - Comprehensive error messages and file validation

## 📋 Tech Stack

### Frontend
- React 18.2
- Tailwind CSS
- Vite (build tool)
- Axios (HTTP client)
- Lucide React (icons)

### Backend
- Flask 2.3.3
- PaddleOCR (PP-OCRv5)
- Groq API
- Python 3.8+
- ReportLab (PDF generation)

### Models
- **OCR Model**: PaddleOCR (English)
- **LLM Model**: Llama 3.3 70B or Mixtral 8x7B (via Groq)

## 🛠️ Installation

### Prerequisites
- Python 3.8 or higher
- Node.js 16 or higher
- Groq API key (get it from [https://console.groq.com](https://console.groq.com))

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   venv\Scripts\activate  # Windows
   source venv/bin/activate  # Mac/Linux
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and add your Groq API key:
   ```
   GROQ_API_KEY=your_api_key_here
   GROQ_MODEL=llama-3.3-70b-versatile
   FLASK_PORT=5000
   ```

5. **Run the backend server:**
   ```bash
   python app.py
   ```
   
   Server will start on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   The default `.env` should work (API URL: `http://localhost:5000`)

4. **Run development server:**
   ```bash
   npm run dev
   ```
   
   Frontend will start on `http://localhost:5173`

5. **Build for production:**
   ```bash
   npm run build
   ```

## 📝 Usage

### Basic Workflow

1. **Upload Prescription**
   - Open the web application
   - Drag & drop or click to select a prescription image
   - Preview the image before uploading
   - Click "Upload & Process"

2. **View Results**
   - **Raw OCR Text**: Original extracted text from the image
   - **Cleaned Prescription**: AI-processed and structured prescription data
   - **Medicines Table**: Organized list with name, dosage, and schedule

3. **Export or Copy**
   - Download as PDF using the download button
   - Copy medicines to clipboard
   - Copy raw text to clipboard

### Supported Image Formats
- PNG, JPG, JPEG, GIF, BMP, WEBP
- Maximum file size: 10MB

## 🔌 API Endpoints

### POST /upload
Upload a prescription image and get cleaned text.

**Request:**
```bash
curl -X POST -F "file=@prescription.jpg" http://localhost:5000/upload
```

**Response:**
```json
{
  "success": true,
  "raw_ocr_text": "Tab Paracetmol 500mg 1-0-1...",
  "cleaned_prescription": {
    "medicines": [
      {
        "name": "Paracetamol",
        "dosage": "500mg",
        "schedule": "1-0-1"
      }
    ],
    "notes": "Take with food"
  },
  "timestamp": "2024-01-15T10:30:00"
}
```

### POST /download-pdf
Generate a PDF from prescription data.

**Request Body:**
```json
{
  "medicines": [
    {
      "name": "Medicine Name",
      "dosage": "500mg",
      "schedule": "1-0-1"
    }
  ],
  "notes": "Additional notes"
}
```

### GET /health
Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00"
}
```

## 🤖 AI Processing Pipeline

### OCR Stage
1. Image is sent to PaddleOCR
2. Text is extracted with confidence scores
3. Multiple OCR passes for accuracy

### LLM Processing Stage
1. Raw OCR text is sent to Groq API
2. Llama 3.3 70B model processes the text
3. Model corrects:
   - Spelling mistakes in medicine names
   - Dosage formats
   - Schedule interpretations
4. Returns structured JSON output

### Example Transformation

**Input (OCR):**
```
Tab Paracetmol 500mg 1-0-1
Cap Amozilin 250mg 0-1-0
```

**Output (Cleaned):**
```json
{
  "medicines": [
    {
      "name": "Paracetamol",
      "dosage": "500mg",
      "schedule": "1-0-1"
    },
    {
      "name": "Amoxicillin",
      "dosage": "250mg",
      "schedule": "0-1-0"
    }
  ]
}
```

## 🐛 Troubleshooting

### "GROQ_API_KEY not found"
- Ensure `.env` file is in the backend directory
- Add your Groq API key: `GROQ_API_KEY=your_key_here`
- Restart the Flask server

### "File too large" Error
- Maximum file size is 10MB
- Compress or resize your image
- Try a different prescription image

### "OCR processing failed"
- Image quality may be too low
- Try a clearer prescription image
- Ensure good lighting in the photo

### "Connection refused"
- Ensure backend server is running on port 5000
- Check firewall settings
- Verify frontend `.env` has correct API URL

### CORS Errors
- Frontend and backend must have correct CORS configuration
- Update `.env` files to match your URLs
- In production, set specific origins instead of wildcards

## 📦 Project Structure

```
project/
├── backend/
│   ├── app.py                 # Flask main application
│   ├── ocr.py                 # PaddleOCR wrapper
│   ├── groq_client.py         # Groq API integration
│   ├── requirements.txt        # Python dependencies
│   ├── uploads/               # Temporary file storage
│   ├── .env                   # Environment variables
│   └── .env.example           # Example environment file
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx            # Main React component
│   │   ├── main.jsx           # React entry point
│   │   ├── index.css          # Global styles
│   │   └── components/
│   │       ├── UploadBox.jsx  # Image upload component
│   │       ├── ResultCard.jsx # Results display component
│   │       └── Loader.jsx     # Loading spinner component
│   ├── index.html             # HTML template
│   ├── package.json           # Node dependencies
│   ├── vite.config.js         # Vite configuration
│   ├── tailwind.config.js     # Tailwind configuration
│   ├── postcss.config.js      # PostCSS configuration
│   ├── .env                   # Frontend environment variables
│   └── .env.example           # Example environment file
│
└── README.md                  # This file
```

## 🚀 Deployment

### Heroku Deployment

1. **Backend:**
   ```bash
   # Create Procfile
   echo "web: gunicorn app:app" > backend/Procfile
   
   # Add gunicorn to requirements.txt
   echo "gunicorn==21.2.0" >> backend/requirements.txt
   
   # Deploy
   git push heroku main
   ```

2. **Frontend:**
   ```bash
   # Build React app
   npm run build
   
   # Deploy to Netlify or Vercel
   ```

### Docker Deployment

1. **Backend Dockerfile:**
   ```dockerfile
   FROM python:3.10-slim
   WORKDIR /app
   COPY requirements.txt .
   RUN pip install -r requirements.txt
   COPY . .
   CMD ["gunicorn", "app:app"]
   ```

2. **Build and run:**
   ```bash
   docker build -t prescription-ocr-backend .
   docker run -p 5000:5000 -e GROQ_API_KEY=your_key prescription-ocr-backend
   ```

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For issues or questions:
1. Check the Troubleshooting section
2. Open an GitHub issue
3. Check Groq API documentation: https://console.groq.com/docs

## 🔐 Security Notes

- **Never commit `.env` files** - They contain sensitive API keys
- Use environment variables for all sensitive data
- In production, use HTTPS only
- Validate all file uploads
- Implement rate limiting for API endpoints
- Use API key rotation regularly

## 🎯 Future Enhancements

- [ ] Multi-language prescription support
- [ ] Barcode/QR code scanning
- [ ] Prescription expiry date tracking
- [ ] Medicine interaction checker
- [ ] Integration with pharmacy APIs
- [ ] Mobile app (React Native)
- [ ] Batch processing for multiple prescriptions
- [ ] User authentication and prescription storage
- [ ] Integration with Electronic Health Records (EHR)

## 📊 Performance Notes

- First OCR inference may take 5-10 seconds (model loading)
- Subsequent calls are faster (~1-3 seconds)
- PaddleOCR is optimized for CPU inference
- Groq API averages 100-200ms response time
