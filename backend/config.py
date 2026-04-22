"""
Configuration settings for the Prescription OCR application
"""

import os
from dotenv import load_dotenv

load_dotenv()

# Groq Configuration
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")

# Flask Configuration
FLASK_ENV = os.getenv("FLASK_ENV", "development")
FLASK_DEBUG = os.getenv("FLASK_DEBUG", "False").lower() == "true"
FLASK_PORT = int(os.getenv("FLASK_PORT", 5000))

# File Upload Configuration
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), "uploads")
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'}

# CORS Configuration
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://localhost:3000").split(",")

# OCR Configuration
OCR_USE_ANGLE_CLS = True
OCR_LANGUAGE = 'en'

# Logging Configuration
LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")
LOG_FORMAT = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"

# Validate required settings
if not GROQ_API_KEY:
    raise ValueError("GROQ_API_KEY environment variable is required")
