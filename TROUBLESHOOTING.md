# Troubleshooting & FAQ

## Common Issues

### Installation Issues

#### Issue: "pip: command not found"
**Solution:**
```bash
# Check Python installation
python --version
python3 --version

# Install pip (if needed)
python -m ensurepip --default-pip

# Or use python3 on Mac/Linux
python3 -m pip install -r requirements.txt
```

#### Issue: "python: command not found"
**Solution:**
- Install Python from https://www.python.org/downloads/
- Ensure Python is added to system PATH
- Verify: `python --version`

#### Issue: Virtual environment creation fails
**Solution:**
```bash
# Try creating with explicit Python version
python3.10 -m venv venv

# Or use virtualenv package
pip install virtualenv
virtualenv venv
```

#### Issue: "npm: command not found"
**Solution:**
- Install Node.js from https://nodejs.org/ (includes npm)
- Verify: `node --version` and `npm --version`

---

### Backend Issues

#### Issue: "GROQ_API_KEY not found"
**Solution:**
1. Create `backend/.env` file
2. Add your API key:
   ```
   GROQ_API_KEY=gsk_xxxxxxxxxxxxx
   ```
3. Restart Flask server
4. Verify with: `echo %GROQ_API_KEY%` (Windows) or `echo $GROQ_API_KEY` (Mac/Linux)

#### Issue: "ModuleNotFoundError: No module named 'paddleocr'"
**Solution:**
```bash
cd backend
pip install paddleocr
# If still fails:
pip cache purge
pip install --no-cache-dir paddleocr
```

#### Issue: "Port 5000 already in use"
**Solution:**
```bash
# Option 1: Change port in backend/.env
FLASK_PORT=5001

# Option 2: Kill process using port 5000 (Windows)
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Option 3: Kill process using port 5000 (Mac/Linux)
lsof -ti:5000 | xargs kill -9
```

#### Issue: "Connection refused" when accessing http://localhost:5000
**Solution:**
1. Ensure backend is running
2. Check Flask output for errors
3. Verify port 5000 is not blocked by firewall
4. Try: `curl http://localhost:5000/health`

#### Issue: "OCR processing failed"
**Solution:**
```bash
# Check image format
# Supported: PNG, JPG, GIF, BMP
# Unsupported: TIFF, WEBP (in some versions)

# Try smaller/clearer image
# Check backend logs for error details
# Verify PaddleOCR model downloaded successfully
```

#### Issue: "Groq API timeout"
**Solution:**
1. Check API key validity at https://console.groq.com
2. Check Groq API status
3. Increase timeout:
   ```python
   # In groq_client.py
   # Adjust timeout parameter
   ```
4. Try with simpler prescription (shorter text)

#### Issue: "Memory error during OCR"
**Solution:**
```bash
# System out of memory
# Solutions:
# 1. Close other applications
# 2. Restart Flask server
# 3. Reduce image resolution before upload
# 4. Use GPU acceleration (optional)
```

---

### Frontend Issues

#### Issue: "npm install fails"
**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

#### Issue: "npm ERR! code ERESOLVE"
**Solution:**
```bash
# Use legacy dependency resolution
npm install --legacy-peer-deps

# Or upgrade npm
npm install -g npm@latest
npm install
```

#### Issue: "Vite server won't start"
**Solution:**
```bash
cd frontend

# Check if port 5173 is in use
# Change port in vite.config.js:
# server: { port: 3000 }

npm run dev
```

#### Issue: "Cannot find module 'react'"
**Solution:**
```bash
cd frontend
npm install react react-dom
```

#### Issue: "Tailwind CSS not working"
**Solution:**
```bash
# Rebuild Tailwind
npm run build
# or restart dev server
npm run dev
```

---

### API Integration Issues

#### Issue: "CORS error in browser console"
**Error:** `Access to XMLHttpRequest at 'http://localhost:5000/upload' from origin 'http://localhost:5173' has been blocked by CORS policy`

**Solution:**
1. Verify backend CORS configuration
2. Check `backend/.env`:
   ```
   CORS_ORIGINS=http://localhost:5173,http://localhost:3000
   ```
3. Restart Flask server
4. Clear browser cache and cookies

#### Issue: "File upload fails silently"
**Solution:**
1. Check browser console for errors
2. Open DevTools (F12)
3. Go to Network tab
4. Try upload again
5. Check response from /upload endpoint
6. Look for error messages

#### Issue: "PDF download not working"
**Solution:**
```bash
# Check if reportlab is installed
pip list | grep reportlab

# If missing:
pip install reportlab

# Restart Flask server
```

---

### Performance Issues

#### Issue: "OCR is very slow"
**Cause:** First-time model loading

**Solution:**
```bash
# First run: 5-10 seconds (model downloads)
# Subsequent runs: 1-3 seconds (cached)
# This is normal behavior
```

#### Issue: "Application uses too much memory"
**Solution:**
```bash
# Restart the application periodically
# Clear browser cache
# Close unused browser tabs
# Reduce concurrent uploads

# For production:
# Implement request queuing
# Use load balancer
# Monitor memory usage
```

#### Issue: "Response times are increasing"
**Solution:**
1. Check server resources (CPU, RAM)
2. Verify Groq API performance
3. Check network connectivity
4. Review server logs for errors
5. Restart services if needed

---

### File Upload Issues

#### Issue: "File too large" error
**Solution:**
- Maximum file size: 10MB
- Compress the image before uploading
- Try different image format
- Resize image (reduce dimensions)

#### Issue: "Unsupported file type" error
**Supported:** PNG, JPG, JPEG, GIF, BMP, WEBP

**Solution:**
- Convert image to supported format
- Check file extension
- Verify MIME type

#### Issue: "Upload hangs or takes forever"
**Solution:**
1. Check file size (< 10MB)
2. Check image resolution (< 4000x4000 px)
3. Check network connection
4. Try different image
5. Check backend logs

---

### Data Issues

#### Issue: "Cleaned text is incorrect"
**Possible causes:**
- Poor image quality
- Handwriting difficult to read
- OCR misread text
- Medicine names not in LLM training

**Solutions:**
1. Try clearer prescription image
2. Manually verify raw OCR text
3. Edit JSON response manually
4. Report specific medicine names not recognized

#### Issue: "Missing medicines in output"
**Solution:**
1. Check raw OCR text
2. Verify medicine names are readable
3. Check JSON output for all fields
4. If truly missing, manually add to JSON

#### Issue: "Medicine names are misspelled"
**Solution:**
- This is usually due to poor OCR or handwriting
- Check raw text first
- Verify expected spelling
- Groq should correct most common misspellings

---

### Security Issues

#### Issue: "Browser shows 'Not Secure' warning"
**Solution:**
- Development mode uses HTTP (not HTTPS)
- This is normal and expected
- HTTPS required for production deployment

#### Issue: "API key visible in network tab"
**Solution:**
1. Check that GROQ_API_KEY is in .env
2. Never commit .env files
3. Use .gitignore
4. Rotate API key if exposed

#### Issue: "Sensitive data in logs"
**Solution:**
- Ensure logs don't contain API keys
- Use environment variables for secrets
- Implement proper logging levels
- Sanitize error messages

---

## FAQ

### Q: How do I get a Groq API key?
**A:**
1. Go to https://console.groq.com
2. Sign up or login
3. Navigate to API keys
4. Create new API key
5. Copy to `backend/.env`

### Q: Can I use a different LLM model?
**A:**
Yes! Available models:
- `llama-3.3-70b-versatile` (recommended)
- `mixtral-8x7b-32768`
- `llama-2-70b-chat`

Update in `backend/.env`:
```
GROQ_MODEL=mixtral-8x7b-32768
```

### Q: What image formats are supported?
**A:** PNG, JPG, JPEG, GIF, BMP, WEBP (max 10MB)

### Q: How long does processing take?
**A:**
- First run: 5-10 seconds (OCR model loads)
- Normal: 2-5 seconds
- Groq API: 100-500ms
- PDF generation: 500-2000ms

### Q: Can I use this offline?
**A:**
- Frontend: Yes (after built)
- OCR: Yes (PaddleOCR runs locally)
- Groq API: No (requires internet)

### Q: Is my data stored anywhere?
**A:**
- No persistent storage on backend
- Images deleted after processing
- No database by default
- Groq API privacy policy applies

### Q: Can I deploy to production?
**A:**
Yes! See [DEPLOYMENT.md](DEPLOYMENT.md) for:
- Heroku
- Docker
- AWS
- Azure
- Kubernetes
- And more!

### Q: How do I contribute?
**A:**
1. Fork repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

### Q: What's the cost?
**A:**
- Groq API: ~$0.10 per 1M tokens (very cheap)
- Typical prescription: ~$0.00005
- Hosting: Varies by platform ($0-200+/month)

### Q: Can I customize the UI?
**A:**
Yes! All React components in `frontend/src/`:
- Modify colors in `src/index.css`
- Change layout in component files
- Use Tailwind CSS classes
- Add new features as needed

### Q: How do I add database support?
**A:**
1. Install database package (e.g., SQLAlchemy)
2. Create models for prescriptions
3. Add endpoints for database operations
4. Update frontend to save history
5. See [ARCHITECTURE.md](ARCHITECTURE.md) for details

### Q: Can I add user authentication?
**A:**
Yes! Recommendations:
- Flask-Login for session management
- JWT tokens for stateless auth
- OAuth2 for social login
- Bcrypt for password hashing

### Q: How do I debug OCR issues?
**A:**
```bash
# Test OCR directly
cd backend
python test_pipeline.py

# Check raw OCR output
# This helps identify if problem is OCR or LLM
```

### Q: How do I improve accuracy?
**A:**
1. Use clearer prescription images
2. Good lighting
3. Straight-on angle
4. No shadows or glare
5. High resolution (300+ DPI if scanning)

### Q: Can I process batch prescriptions?
**A:**
- Current: One at a time via UI
- Future: Batch API endpoint
- Could process multiple files in loop
- See code for implementation

### Q: How do I handle medicine allergies?
**A:**
1. Add allergy checking logic
2. Integrate with allergy database
3. Display warnings in UI
4. Could be future feature

### Q: What if OCR misreads text?
**A:**
1. Check raw OCR output first
2. Manually correct if needed
3. Report issue with sample image
4. Try different image quality
5. Consider manual typing for critical errors

### Q: Can I export to different formats?
**A:**
Currently: PDF only
Could add:
- CSV export
- Excel export
- JSON export (already available via API)
- XML export
- See React component for implementation

### Q: How do I set up monitoring?
**A:**
1. Use application monitoring service (e.g., Sentry)
2. Implement logging (Python logging module)
3. Monitor API response times
4. Track error rates
5. Monitor resource usage

### Q: Can I use this in a hospital/clinic?
**A:**
Yes! Recommendations:
- Ensure HIPAA compliance (if in US)
- Implement user authentication
- Add prescription storage
- Implement audit logging
- Regular backups
- Security hardening
- Legal/compliance review

---

## Performance Benchmarks

### Processing Time
| Task | Time |
|------|------|
| Image validation | 10ms |
| File save | 20ms |
| OCR (first) | 5-10s |
| OCR (cached) | 1-3s |
| Groq API | 100-500ms |
| PDF generation | 500-2000ms |
| **Total (first)** | **6-11s** |
| **Total (normal)** | **2-5s** |

### Memory Usage
| Component | Memory |
|-----------|--------|
| Flask app | 100MB |
| PaddleOCR model | 400MB |
| React app | 5MB |
| Per request | 50MB |

### API Response Sizes
| Endpoint | Size |
|----------|------|
| /upload response | 2-5KB |
| Raw text | 1-2KB |
| Cleaned JSON | 1-3KB |
| PDF file | 50-200KB |

---

## Getting Help

1. **Check this guide** - Most common issues covered
2. **Check logs** - Backend and frontend logs have clues
3. **Check API status** - Groq API might be down
4. **Check GitHub** - Issues and discussions
5. **Contact support** - If all else fails

---

For more detailed information, see:
- [README.md](README.md) - Complete documentation
- [API_DOCS.md](API_DOCS.md) - API endpoint details
- [ARCHITECTURE.md](ARCHITECTURE.md) - System design
- [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment guides
- [DEPENDENCIES.md](DEPENDENCIES.md) - Dependency information
