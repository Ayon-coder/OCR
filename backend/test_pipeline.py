"""
Example script to test the OCR pipeline locally
"""

import os
import sys
from pathlib import Path

# Add backend to path
sys.path.insert(0, os.path.dirname(__file__))

from ocr import extract_text_from_image
from groq_client import GroqPrescriptionCleaner
import json


def test_ocr_groq_pipeline(image_path: str):
    """Test the complete OCR + Groq pipeline."""
    
    print(f"🔍 Testing prescription OCR pipeline...")
    print(f"📷 Image: {image_path}\n")
    
    # Step 1: Extract text with OCR
    print("Step 1: Extracting text with PaddleOCR...")
    try:
        raw_text = extract_text_from_image(image_path)
        print(f"✓ OCR completed")
        print(f"📝 Extracted text:\n{raw_text}\n")
    except Exception as e:
        print(f"✗ OCR failed: {e}")
        return
    
    # Step 2: Clean with Groq
    print("Step 2: Cleaning with Groq LLM...")
    try:
        cleaner = GroqPrescriptionCleaner()
        cleaned = cleaner.clean_prescription_text(raw_text)
        print(f"✓ Groq processing completed")
        print(f"📋 Cleaned output:\n{json.dumps(cleaned, indent=2)}\n")
    except Exception as e:
        print(f"✗ Groq processing failed: {e}")
        return
    
    print("✓ Pipeline test completed successfully!")
    return cleaned


if __name__ == "__main__":
    # Test with a sample prescription image
    # Replace with your actual prescription image path
    
    test_image = "uploads/sample_prescription.jpg"
    
    if not os.path.exists(test_image):
        print(f"❌ Test image not found: {test_image}")
        print("Please provide a prescription image in the uploads folder")
        sys.exit(1)
    
    result = test_ocr_groq_pipeline(test_image)
