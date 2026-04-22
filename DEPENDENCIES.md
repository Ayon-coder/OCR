# Dependencies & Requirements

## Python Dependencies (Backend)

### Flask & Web Framework
- **Flask** (2.3.3) - Lightweight Python web framework
- **Flask-CORS** (4.0.0) - Cross-Origin Resource Sharing support
- **Gunicorn** (optional, for production) - WSGI HTTP Server

### OCR Processing
- **PaddleOCR** (2.7.0.3) - Optical Character Recognition
- **PaddlePaddle** (2.5.1) - Deep learning framework
- **opencv-python** (4.8.1.78) - Computer vision library

### LLM Integration
- **Groq** (0.4.2) - Groq Python SDK for API calls

### Document Generation
- **ReportLab** (4.0.7) - PDF document generation
- **Pillow** (10.0.1) - Image processing

### Utilities
- **python-dotenv** (1.0.0) - Environment variable management

### Optional (for development)
- **pytest** - Testing framework
- **black** - Code formatter
- **flake8** - Linting
- **autopep8** - Code formatter

## Node.js Dependencies (Frontend)

### Core Framework
- **react** (18.2.0) - UI library
- **react-dom** (18.2.0) - React DOM rendering

### HTTP & API
- **axios** (1.5.0) - Promise-based HTTP client

### UI & Icons
- **lucide-react** (0.263.0) - Icon library

### Build & Development
- **vite** (4.4.9) - Next generation frontend tooling
- **@vitejs/plugin-react** (4.0.3) - React plugin for Vite

### Styling
- **tailwindcss** (3.3.3) - Utility-first CSS framework
- **postcss** (8.4.28) - Tool for transforming CSS
- **autoprefixer** (10.4.14) - Adds vendor prefixes to CSS

### Development Tools
- **eslint** (8.50.0) - JavaScript linter
- **eslint-plugin-react** (7.33.2) - React linting rules

## System Requirements

### Minimum Requirements
- **OS**: Windows 10+, macOS 10.15+, Linux (Ubuntu 18.04+)
- **Python**: 3.8 or higher
- **Node.js**: 16 LTS or higher
- **npm**: 7 or higher
- **RAM**: 2GB minimum (4GB recommended)
- **Storage**: 500MB minimum (1GB recommended for OCR model)
- **CPU**: 2 cores minimum

### Recommended Requirements
- **Python**: 3.10+
- **Node.js**: 18 LTS+
- **RAM**: 4GB+
- **Storage**: 2GB+
- **CPU**: 4 cores+
- **GPU**: Optional (speeds up OCR)

## Installation & Setup

### Install Python Dependencies

```bash
cd backend
pip install -r requirements.txt
```

or with specific versions:

```bash
pip install Flask==2.3.3 Flask-CORS==4.0.0 python-dotenv==1.0.0 \
    paddleocr==2.7.0.3 paddlepaddle==2.5.1 groq==0.4.2 \
    Pillow==10.0.1 opencv-python==4.8.1.78 reportlab==4.0.7
```

### Install Node.js Dependencies

```bash
cd frontend
npm install
```

or specific versions:

```bash
npm install react@18.2.0 react-dom@18.2.0 axios@1.5.0 lucide-react@0.263.0
```

## Version Compatibility

### Python Version Compatibility
- ✅ Python 3.8, 3.9, 3.10, 3.11
- ⚠️ Python 3.12 (check compatibility)
- ❌ Python 2.7 (not supported)
- ❌ Python < 3.8 (not supported)

### Node.js Version Compatibility
- ✅ Node 16 LTS
- ✅ Node 18 LTS
- ✅ Node 20 LTS
- ❌ Node < 14 (not supported)

### Operating System Support
- ✅ Windows 10/11
- ✅ macOS 10.15+
- ✅ Ubuntu 18.04+
- ✅ Debian 10+
- ✅ CentOS 7+

## Dependency Conflicts & Solutions

### PaddleOCR + OpenCV
- **Issue**: Version conflicts can occur
- **Solution**: Install in order: `pip install opencv-python paddleocr`

### NumPy Version
- **Issue**: Old projects might have NumPy <1.23
- **Solution**: Run `pip install --upgrade numpy`

### Flask + Werkzeug
- **Issue**: Werkzeug version conflicts
- **Solution**: Use compatible Flask version (Flask 2.3+ includes compatible Werkzeug)

### Pillow
- **Issue**: May require libjpeg-turbo on Linux
- **Solution**: `sudo apt install libjpeg-dev` (Debian/Ubuntu)

## Security Updates

### Checking for Vulnerable Packages

```bash
# Python
pip check
pip list --outdated

# Node.js
npm audit
npm outdated
```

### Updating Dependencies

```bash
# Python - Update all packages
pip install --upgrade -r requirements.txt

# Update specific package
pip install --upgrade package_name

# Node.js - Update all packages
npm update

# Update specific package
npm install package_name@latest
```

## Docker Image Size

### Optimized Dockerfile
```dockerfile
FROM python:3.10-slim

# Reduces image size by excluding unnecessary build tools
```

### Base Image Sizes
- `python:3.10-slim` - ~150MB
- `python:3.10` - ~900MB
- `node:18-alpine` - ~150MB
- `node:18` - ~900MB

## Performance Impact

### OCR Model Loading
- **First Load**: 5-10 seconds (model downloads ~100MB)
- **Subsequent Loads**: <100ms (cached)
- **Memory**: ~500MB after loading

### Frontend Bundle Size
- **Development**: ~400KB
- **Production**: ~150KB (minified + gzipped)

### Typical Response Times
- **OCR**: 1-3 seconds
- **Groq API**: 100-500ms
- **PDF Generation**: 500-2000ms
- **Total**: 2-5 seconds

## Dependency Management Best Practices

### Pinning Versions
```txt
# ✅ Good - Specific versions
Flask==2.3.3
numpy==1.24.3

# ⚠️ Acceptable - Minor version range
Flask>=2.3.0,<2.4.0

# ❌ Avoid - Latest always
Flask
numpy
```

### Development vs Production

**requirements-dev.txt**
```
-r requirements.txt
pytest==7.4.0
pytest-cov==4.1.0
black==23.9.1
flake8==6.1.0
autopep8==2.0.2
```

### Lock Files
- Use `pip freeze > requirements.lock` for exact reproduction
- Use `package-lock.json` automatically with npm

## Troubleshooting Dependency Issues

### "ModuleNotFoundError: No module named 'paddle'"
```bash
pip install paddleocr
# or
pip install paddlepaddle paddleocr
```

### "ModuleNotFoundError: No module named 'groq'"
```bash
pip install groq
```

### "React not found" (Frontend)
```bash
cd frontend
npm install react react-dom
```

### Version Conflicts
```bash
# Clear cache and reinstall
pip cache purge
pip install --no-cache-dir -r requirements.txt
```

### CUDA Issues (GPU acceleration)
```bash
# For GPU support
pip install paddlepaddle-gpu
# or CPU fallback
pip install paddlepaddle
```

## License Information

### Backend Dependencies
- Flask: BSD License
- PaddleOCR: Apache License 2.0
- Groq SDK: Apache License 2.0
- ReportLab: BSD License
- Pillow: HPND License

### Frontend Dependencies
- React: MIT License
- Tailwind CSS: MIT License
- Axios: MIT License
- Lucide React: ISC License
- Vite: MIT License

All dependencies are open-source and compatible with commercial use.

## Updating Dependencies

### Check for Updates
```bash
# Python
pip list --outdated

# Node.js
npm outdated
```

### Update All
```bash
# Python
pip install -r requirements.txt --upgrade

# Node.js
npm update
```

### Update Specific Package
```bash
# Python
pip install --upgrade Flask

# Node.js
npm install react@latest
```

## Performance Tips

1. **Use Python 3.11+** - Better performance
2. **Enable GPU** - For OCR acceleration
3. **Cache models** - Don't reload unnecessarily
4. **Use production builds** - Minified frontend assets
5. **Enable gzip compression** - Reduce transfer size

## Support & Compatibility Matrix

| Component | Latest | LTS | Supported |
|-----------|--------|-----|-----------|
| Python | 3.12 | 3.10 | 3.8+ |
| Node.js | 20 | 18 | 16+ |
| Flask | 2.3 | 2.3 | 2.0+ |
| React | 18 | 18 | 17+ |
| PaddleOCR | 2.7 | 2.7 | 2.5+ |

---

For the latest dependency versions, check:
- Python packages: https://pypi.org/
- Node packages: https://www.npmjs.com/
- Flask: https://flask.palletsprojects.com/
- React: https://react.dev/
