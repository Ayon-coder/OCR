"""
Flask Backend for Prescription OCR Application
"""
import os
import json
import logging
from datetime import datetime
from werkzeug.utils import secure_filename
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from ocr import extract_text_from_image
from groq_client import GroqPrescriptionCleaner

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Configuration
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = MAX_FILE_SIZE

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Groq cleaner
try:
    groq_cleaner = GroqPrescriptionCleaner(
        api_key=os.getenv("GROQ_API_KEY"),
        model=os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")
    )
except Exception as e:
    logger.warning(f"Groq initialization warning: {str(e)}")
    groq_cleaner = None


def allowed_file(filename):
    """Check if file extension is allowed."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({"status": "healthy", "timestamp": datetime.now().isoformat()}), 200


@app.route('/upload', methods=['POST'])
def upload_prescription():
    """
    Upload and process prescription image.
    
    Returns:
        JSON response with OCR text and cleaned prescription data
    """
    try:
        # Check if file is present
        if 'file' not in request.files:
            return jsonify({"error": "No file provided"}), 400
        
        file = request.files['file']
        
        # Check if file is selected
        if file.filename == '':
            return jsonify({"error": "No file selected"}), 400
        
        # Validate file type
        if not allowed_file(file.filename):
            return jsonify({"error": f"File type not allowed. Allowed: {', '.join(ALLOWED_EXTENSIONS)}"}), 400
        
        # Save file
        filename = secure_filename(f"{datetime.now().timestamp()}_{file.filename}")
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # Verify file exists and is readable
        if not os.path.exists(filepath):
            return jsonify({"error": f"File save failed: file does not exist at {filepath}"}), 500
        
        if not os.path.isfile(filepath):
            return jsonify({"error": f"Invalid file path: {filepath}"}), 500
        
        file_size = os.path.getsize(filepath)
        if file_size == 0:
            return jsonify({"error": "Uploaded file is empty"}), 400
        
        logger.info(f"File saved: {filepath} (size: {file_size} bytes)")
        
        # Extract text using OCR
        logger.info("Starting OCR processing...")
        try:
            raw_ocr_text = extract_text_from_image(filepath)
        except Exception as ocr_error:
            logger.error(f"OCR error: {str(ocr_error)}", exc_info=True)
            return jsonify({"error": f"OCR failed: {str(ocr_error)}"}), 500
        logger.info(f"OCR completed. Extracted text length: {len(raw_ocr_text)}")
        
        # Clean prescription using Groq
        logger.info("Starting Groq processing...")
        if groq_cleaner is None:
            return jsonify({
                "error": "Groq API not configured",
                "raw_text": raw_ocr_text
            }), 500
        
        cleaned_data = groq_cleaner.clean_prescription_text(raw_ocr_text)
        logger.info("Groq processing completed")
        
        # Prepare response
        response = {
            "success": True,
            "raw_ocr_text": raw_ocr_text,
            "cleaned_prescription": cleaned_data,
            "filename": filename,
            "timestamp": datetime.now().isoformat()
        }
        
        # Clean up uploaded file after processing
        try:
            os.remove(filepath)
        except Exception as e:
            logger.warning(f"Could not delete temporary file: {str(e)}")
        
        return jsonify(response), 200
    
    except Exception as e:
        logger.error(f"Error processing prescription: {str(e)}")
        return jsonify({"error": str(e), "type": type(e).__name__}), 500


@app.route('/download-pdf', methods=['POST'])
def download_pdf():
    """
    Generate PDF from prescription data.
    
    Request body:
    {
        "medicines": [...],
        "notes": "..."
    }
    """
    try:
        from reportlab.lib.pagesizes import letter
        from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
        from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
        from reportlab.lib import colors
        from io import BytesIO
        
        data = request.get_json()
        medicines = data.get('medicines', [])
        notes = data.get('notes', '')
        
        # Create PDF in memory
        pdf_buffer = BytesIO()
        doc = SimpleDocTemplate(pdf_buffer, pagesize=letter)
        story = []
        
        # Styles
        styles = getSampleStyleSheet()
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=24,
            textColor=colors.HexColor('#0066cc'),
            spaceAfter=30,
            alignment=1
        )
        
        # Title
        story.append(Paragraph("Prescription", title_style))
        story.append(Spacer(1, 0.2))
        
        # Medicines table
        if medicines:
            table_data = [["Medicine", "Dosage", "Schedule"]]
            for med in medicines:
                table_data.append([
                    med.get('name', ''),
                    med.get('dosage', ''),
                    med.get('schedule', '')
                ])
            
            table = Table(table_data, colWidths=[2.5*72, 1.5*72, 1.5*72])
            table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#0066cc')),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, 0), 14),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
                ('GRID', (0, 0), (-1, -1), 1, colors.black)
            ]))
            story.append(table)
        
        # Notes
        if notes:
            story.append(Spacer(1, 0.3))
            story.append(Paragraph("<b>Notes:</b>", styles['Heading2']))
            story.append(Paragraph(notes, styles['Normal']))
        
        # Build PDF
        doc.build(story)
        pdf_buffer.seek(0)
        
        return pdf_buffer.getvalue(), 200, {
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename=prescription.pdf'
        }
    
    except Exception as e:
        logger.error(f"Error generating PDF: {str(e)}")
        return jsonify({"error": str(e)}), 500


@app.errorhandler(413)
def request_entity_too_large(error):
    """Handle file too large error."""
    return jsonify({"error": f"File too large. Maximum size: {MAX_FILE_SIZE / 1024 / 1024}MB"}), 413


@app.errorhandler(404)
def not_found(error):
    """Handle 404 error."""
    return jsonify({"error": "Endpoint not found"}), 404


@app.errorhandler(500)
def internal_error(error):
    """Handle 500 error."""
    return jsonify({"error": "Internal server error"}), 500


if __name__ == '__main__':
    debug_mode = os.getenv("FLASK_DEBUG", "False").lower() == "true"
    port = int(os.getenv("FLASK_PORT", 5000))
    
    logger.info(f"Starting Flask server on port {port} (Debug: {debug_mode})")
    app.run(debug=debug_mode, host='0.0.0.0', port=port)
