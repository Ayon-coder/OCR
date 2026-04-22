# API Documentation - Prescription OCR

## Base URL
```
http://localhost:5000
```

---

## Endpoints

### 1. Health Check

**Endpoint:** `GET /health`

**Description:** Verify that the backend server is running and healthy.

**Response (200 OK):**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.123456"
}
```

**Example:**
```bash
curl http://localhost:5000/health
```

---

### 2. Upload Prescription

**Endpoint:** `POST /upload`

**Description:** Upload a prescription image, extract text using OCR, and clean it using Groq LLM.

**Request:**
- **Method:** POST
- **Content-Type:** multipart/form-data
- **Parameters:**
  - `file` (required): Image file (PNG, JPG, GIF, BMP, WEBP)
  - Max size: 10MB

**Response (200 OK):**
```json
{
  "success": true,
  "raw_ocr_text": "Tab Paracetmol 500mg 1-0-1\nCap Amozilin 250mg 0-1-0",
  "cleaned_prescription": {
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
    ],
    "notes": "Take with food",
    "raw_text": "Tab Paracetmol 500mg 1-0-1\nCap Amozilin 250mg 0-1-0"
  },
  "filename": "1705322400.0_prescription.jpg",
  "timestamp": "2024-01-15T10:30:00.123456"
}
```

**Error Responses:**

- **400 Bad Request** - No file provided:
```json
{
  "error": "No file provided"
}
```

- **400 Bad Request** - No file selected:
```json
{
  "error": "No file selected"
}
```

- **400 Bad Request** - Invalid file type:
```json
{
  "error": "File type not allowed. Allowed: png, jpg, jpeg, gif, bmp, webp"
}
```

- **413 Payload Too Large** - File exceeds max size:
```json
{
  "error": "File too large. Maximum size: 10.0MB"
}
```

- **500 Internal Server Error** - Processing failed:
```json
{
  "error": "OCR processing failed: [error details]",
  "type": "Exception"
}
```

**Examples:**

Using cURL:
```bash
curl -X POST -F "file=@prescription.jpg" http://localhost:5000/upload
```

Using Python:
```python
import requests

with open('prescription.jpg', 'rb') as f:
    files = {'file': f}
    response = requests.post('http://localhost:5000/upload', files=files)
    print(response.json())
```

Using JavaScript/Fetch:
```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);

const response = await fetch('http://localhost:5000/upload', {
  method: 'POST',
  body: formData
});

const data = await response.json();
console.log(data);
```

Using Axios (JavaScript):
```javascript
import axios from 'axios';

const formData = new FormData();
formData.append('file', file);

const response = await axios.post('http://localhost:5000/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});

console.log(response.data);
```

---

### 3. Download Prescription as PDF

**Endpoint:** `POST /download-pdf`

**Description:** Generate a PDF document from prescription data.

**Request:**
- **Method:** POST
- **Content-Type:** application/json
- **Body:**
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
  ],
  "notes": "Take with food. Avoid alcohol."
}
```

**Response (200 OK):**
- **Content-Type:** application/pdf
- Binary PDF file

**Headers:**
```
Content-Disposition: attachment; filename=prescription.pdf
```

**Error Responses:**

- **500 Internal Server Error** - PDF generation failed:
```json
{
  "error": "Error generating PDF: [error details]"
}
```

**Examples:**

Using cURL:
```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{"medicines":[{"name":"Paracetamol","dosage":"500mg","schedule":"1-0-1"}],"notes":"Take with food"}' \
  http://localhost:5000/download-pdf \
  --output prescription.pdf
```

Using Python:
```python
import requests
import json

data = {
  "medicines": [
    {
      "name": "Paracetamol",
      "dosage": "500mg",
      "schedule": "1-0-1"
    }
  ],
  "notes": "Take with food"
}

response = requests.post(
  'http://localhost:5000/download-pdf',
  json=data
)

with open('prescription.pdf', 'wb') as f:
    f.write(response.content)
```

Using JavaScript/Fetch:
```javascript
const data = {
  medicines: [
    {
      name: "Paracetamol",
      dosage: "500mg",
      schedule: "1-0-1"
    }
  ],
  notes: "Take with food"
};

const response = await fetch('http://localhost:5000/download-pdf', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
});

const blob = await response.blob();
const url = window.URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'prescription.pdf';
a.click();
```

---

## Response Format

### Success Response
All successful responses follow this structure:
```json
{
  "success": true,
  "data": {...},
  "timestamp": "ISO 8601 timestamp"
}
```

### Error Response
All error responses follow this structure:
```json
{
  "error": "Error message",
  "type": "Exception type (optional)"
}
```

---

## Status Codes

| Code | Description |
|------|-------------|
| 200 | OK - Request successful |
| 400 | Bad Request - Invalid input |
| 413 | Payload Too Large - File exceeds size limit |
| 404 | Not Found - Endpoint doesn't exist |
| 500 | Internal Server Error - Server error |

---

## Rate Limiting

No explicit rate limiting is implemented, but consider adding:
- Per-IP rate limiting
- Per-API-key rate limiting
- Request queuing for long operations

---

## Authentication

Currently, the API is open without authentication. For production:
- Implement API key authentication
- Use OAuth2 or JWT
- Add user authentication

---

## CORS Headers

The backend includes CORS headers to allow requests from:
- `http://localhost:5173` (Frontend dev)
- `http://localhost:3000` (Alternative frontend)

Update `backend/.env` for production URLs:
```
CORS_ORIGINS=https://yourdomain.com,https://app.yourdomain.com
```

---

## Timeouts

- **OCR Processing:** 30-60 seconds (first run), 2-5 seconds (cached)
- **Groq API:** 30 seconds
- **Overall Request:** 120 seconds

---

## Example Workflow

```javascript
// Step 1: Upload and process prescription
const uploadResponse = await fetch('/upload', {
  method: 'POST',
  body: formData
});
const uploadData = await uploadResponse.json();

// Step 2: Access cleaned prescription
const medicines = uploadData.cleaned_prescription.medicines;
console.log('Medicines:', medicines);

// Step 3: Generate PDF
const pdfResponse = await fetch('/download-pdf', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    medicines: medicines,
    notes: uploadData.cleaned_prescription.notes
  })
});

// Step 4: Download PDF
const blob = await pdfResponse.blob();
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'prescription.pdf';
a.click();
```

---

## Troubleshooting

### Connection Refused
- Ensure backend server is running: `python app.py`
- Check port 5000 is available
- Verify firewall settings

### CORS Errors
- Frontend URL must be in `CORS_ORIGINS` in `.env`
- Restart backend after changing `.env`

### Timeout Errors
- Large images may take longer to process
- Check backend logs for errors
- Try with a smaller, clearer image

### API Key Error
- Ensure `GROQ_API_KEY` is set in `backend/.env`
- Verify key is valid in Groq console
- Restart backend after changing key

---

## Support

For issues or questions:
1. Check backend logs
2. Test endpoint with cURL
3. Check Groq API status
4. Review error response format
