# Architecture & Technical Design

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (Browser)                         │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  React Frontend (Vite)                                   │  │
│  │  - Drag & Drop Upload                                    │  │
│  │  - Image Preview                                         │  │
│  │  - Results Display                                       │  │
│  │  - Dark Mode Support                                     │  │
│  │  - PDF Download                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                   │
│                              │ REST API                          │
│                              ▼                                   │
└─────────────────────────────────────────────────────────────────┘
                               │
                    ┌──────────┴──────────┐
                    │                     │
                    ▼                     ▼
        ┌──────────────────────┐ ┌─────────────────────┐
        │  Flask Backend       │ │  External APIs      │
        │  (Python)            │ │  - Groq LLM API     │
        │                      │ │                     │
        │ ┌──────────────────┐ │ │                     │
        │ │ /upload endpoint │ │ │                     │
        │ │ - File validation│ │ │                     │
        │ │ - OCR processing │ │ │                     │
        │ │ - Text cleaning  │ │ │                     │
        │ │ - JSON response  │ │ │                     │
        │ └──────────────────┘ │ │                     │
        │                      │ │                     │
        │ ┌──────────────────┐ │ │                     │
        │ │ /download-pdf    │ │ │                     │
        │ └──────────────────┘ │ │                     │
        │                      │ │                     │
        │ ┌──────────────────┐ │ │                     │
        │ │ Storage/Uploads  │ │ │                     │
        │ └──────────────────┘ │ │                     │
        │                      │ │                     │
        └──────────────────────┘ └─────────────────────┘
                    │                     │
                    ▼                     ▼
        ┌──────────────────────┐ ┌─────────────────────┐
        │ PaddleOCR Engine     │ │ Groq LLM            │
        │ - Text Extraction    │ │ - Llama 3.3 70B     │
        │ - Character Detection│ │ - Text Cleaning     │
        │ - Layout Analysis    │ │ - JSON Generation   │
        │                      │ │                     │
        └──────────────────────┘ └─────────────────────┘
```

---

## Data Flow

### Prescription Processing Pipeline

```
1. User Input
   └─> Image file (drag & drop or click)
       └─> Frontend validation
           └─> File type check
           └─> Size check (max 10MB)

2. Upload Phase
   └─> FormData with file sent to /upload endpoint
       └─> Backend receives file
           └─> Temporary save
           └─> MIME type validation

3. OCR Extraction Phase
   └─> PaddleOCR processes image
       └─> Extract text with confidence scores
           └─> Multi-line text extraction
           └─> Handle rotated/skewed images

4. Raw Text
   └─> "Tab Paracetmol 500mg 1-0-1"
   └─> "Cap Amozilin 250mg 0-1-0"
   └─> Additional patient notes

5. LLM Cleaning Phase
   └─> Text sent to Groq API
       └─> Llama 3.3 70B model processes
           └─> Spell correction
           └─> Medicine name standardization
           └─> Dosage format normalization
           └─> Schedule interpretation
           └─> Return as structured JSON

6. Structured Output
   └─> JSON with medicines array
       ├─> Medicine name (corrected)
       ├─> Dosage amount
       ├─> Schedule timing
       └─> Additional notes

7. Response to Frontend
   └─> Raw OCR text
   └─> Cleaned prescription data
   └─> Timestamp
   └─> Filename

8. User Actions
   ├─> View raw text
   ├─> View cleaned data
   ├─> Copy to clipboard
   ├─> Download as PDF
   └─> Process another prescription
```

---

## Component Architecture

### Frontend Components

```
App.jsx (Main Container)
├── Header
│   ├── Logo/Branding
│   ├── Dark Mode Toggle
│   └── GitHub Link
│
├── Main Content
│   ├── UploadBox (Drag & Drop)
│   │   ├── File Input
│   │   ├── Preview
│   │   ├── Upload Button
│   │   └── Clear Button
│   │
│   ├── Loader (Processing)
│   │   ├── Spinner
│   │   ├── Status Messages
│   │   └── Progress Steps
│   │
│   ├── ResultCard (Results)
│   │   ├── Raw Text Tab
│   │   │   ├── OCR Output Display
│   │   │   └── Copy Button
│   │   │
│   │   ├── Cleaned Tab
│   │   │   ├── Medicines Table
│   │   │   ├── Notes Section
│   │   │   ├── Copy Medicines Button
│   │   │   └── Download PDF Button
│   │   │
│   │   └── Error Display
│   │
│   └── Process Another Button
│
├── Sidebar
│   ├── Features List
│   └── Recent History
│
└── Footer
    └── Credits
```

---

## Backend Modules

### ocr.py
```python
- extract_text_from_image(image_path)
  ├─> Input: image file path
  ├─> Process: PaddleOCR inference
  ├─> Output: extracted text string
  
- extract_text_with_confidence(image_path)
  ├─> Input: image file path
  ├─> Process: PaddleOCR with confidence scores
  ├─> Output: list of (text, confidence) tuples
```

### groq_client.py
```python
- GroqPrescriptionCleaner class
  ├─> __init__(api_key, model)
  │   └─> Initialize Groq client
  │
  ├─> clean_prescription_text(raw_ocr_text)
  │   ├─> Build prompt
  │   ├─> Call Groq API
  │   ├─> Parse response JSON
  │   └─> Return structured data
  │
  └─> _build_prompt(raw_ocr_text)
      └─> Create medical-specific prompt
```

### app.py
```python
- Flask application
  ├─> Routes:
  │   ├─> GET /health
  │   ├─> POST /upload
  │   ├─> POST /download-pdf
  │   ├─> 404 handler
  │   ├─> 413 handler (file too large)
  │   └─> 500 handler (errors)
  │
  └─> Configuration:
      ├─> Upload folder
      ├─> File size limits
      ├─> Allowed extensions
      ├─> CORS setup
      └─> Error handlers
```

---

## API Request Flow

### Upload Request

```
Client Request:
POST /upload
Content-Type: multipart/form-data
Body: binary image file

Server Processing:
1. Receive file
2. Validate file type & size
3. Save temporarily
4. Run OCR (PaddleOCR)
   └─> Extract text
5. Send to Groq
   └─> Clean & structure
6. Generate response JSON
7. Delete temp file
8. Return response

Response:
{
  "success": true,
  "raw_ocr_text": "...",
  "cleaned_prescription": {
    "medicines": [...],
    "notes": "..."
  },
  "timestamp": "..."
}
```

---

## Error Handling

### Frontend Error Handling
```
Upload → Network error
       → File validation error
       → API error response
       → JSON parsing error
       └─> Display user-friendly message
```

### Backend Error Handling
```
File Upload → Invalid file type (400)
           → File too large (413)
           → Save failed (500)

OCR Processing → Model loading error (500)
               → Invalid image format (500)
               → Processing timeout (500)

Groq API Call → API key invalid (500)
              → Rate limited (500)
              → JSON parse error (500)
              → Timeout (500)
```

---

## Security Considerations

### Input Validation
- File type whitelist (PNG, JPG, GIF, BMP, WEBP)
- File size limit (10MB)
- Filename sanitization
- MIME type checking

### API Security
- CORS configuration (specific origins)
- Rate limiting (recommended)
- Error message sanitization (no server internals)
- File cleanup (no persistent storage)

### Data Privacy
- No file storage on server
- No image logging
- No text persistence
- Groq API privacy policy applies

---

## Performance Optimization

### Frontend
- React lazy loading
- Component memoization
- CSS-in-JS with Tailwind
- Image preview compression

### Backend
- PaddleOCR model caching
- Connection pooling
- Async task processing (optional)
- Response compression

### Infrastructure
- CDN for static files
- Load balancing
- Database caching (if applicable)
- API rate limiting

---

## Deployment Architecture

### Production Setup
```
┌──────────────────────────────────────────┐
│         Reverse Proxy (nginx)             │
├──────────────────────────────────────────┤
│  ┌──────────────┐    ┌──────────────┐   │
│  │ Load Balancer│───│  Backend 1   │   │
│  │              │───│  Backend 2   │   │
│  │              │───│  Backend 3   │   │
│  └──────────────┘    └──────────────┘   │
│        │                                 │
│        ├─────────────────────────────────│
│        │                                 │
│  ┌──────────────────────────────────┐   │
│  │  Static File Server / CDN        │   │
│  │  Frontend React App              │   │
│  └──────────────────────────────────┘   │
│                                          │
└──────────────────────────────────────────┘
         │
         ├──────────────────┐
         ▼                  ▼
    Groq API          External Storage
```

---

## Technology Choices

### Why React?
- Fast virtual DOM
- Component reusability
- Large ecosystem
- Easy state management

### Why Flask?
- Lightweight
- Easy to learn
- Great for microservices
- Excellent OCR library support

### Why PaddleOCR?
- High accuracy for medical text
- Fast inference
- Multi-language support
- Easy integration

### Why Groq?
- Fast LLM inference
- Multiple models available
- Cost-effective
- Reliable API

---

## Scaling Strategy

### Horizontal Scaling
- Multiple backend instances
- Load balancer (HAProxy/Nginx)
- Distributed file storage

### Vertical Scaling
- Increase server resources
- Database optimization
- Query caching

### Future Enhancements
- Microservices architecture
- Message queue (Celery/RabbitMQ)
- Database (PostgreSQL)
- User authentication
- Request caching
- Analytics/metrics

---

## Technology Stack Summary

| Layer | Technology |
|-------|-----------|
| Frontend | React, Tailwind CSS, Vite |
| Backend | Flask, Python |
| OCR | PaddleOCR |
| LLM | Groq API (Llama 3.3) |
| Export | ReportLab (PDF) |
| HTTP Client | Axios (Frontend), Requests (Backend) |
| State | React hooks, Context API |
| Build | Vite, npm |
| Deployment | Docker, Docker Compose, Kubernetes |

This architecture provides scalability, maintainability, and good separation of concerns.
