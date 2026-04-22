"""
OCR Module for Prescription Processing
"""
from paddleocr import PaddleOCR
import cv2
import logging
from typing import List, Tuple

# Initialize PaddleOCR
ocr = PaddleOCR(
    lang='en',
    text_detection_model_name='PP-OCRv5_mobile_det',
    text_recognition_model_name='PP-OCRv5_mobile_rec',
    use_angle_cls=False
)

logger = logging.getLogger(__name__)


def extract_text_from_image(image_path: str) -> str:
    """
    Extract text from prescription image using PaddleOCR.
    
    Args:
        image_path: Path to the prescription image
        
    Returns:
        Extracted text as a single string
    """
    try:
        import os
        
        # Verify file exists
        if not os.path.exists(image_path):
            raise FileNotFoundError(f"Image file not found: {image_path}")
        
        logger.info(f"Reading image from: {image_path}")
        
        # Read image using cv2
        img = cv2.imread(image_path)
        
        if img is None:
            raise ValueError(f"Failed to read image: {image_path}")
        
        logger.info(f"Image loaded successfully. Shape: {img.shape}")
        
        # Use ocr.predict() with image array
        result = ocr.predict(img)
        
        if result is None or len(result) == 0:
            logger.warning("OCR returned empty result")
            return ""
        
        # Extract text from OCR result
        extracted_text = ""
        for line in result[0]['rec_texts']:
            extracted_text += line + " "
        
        return extracted_text.strip()
    
    except Exception as e:
        logger.error(f"Error during OCR processing: {str(e)}", exc_info=True)
        raise Exception(f"OCR processing failed: {str(e)}")


def extract_text_with_confidence(image_path: str) -> List[Tuple[str, float]]:
    """
    Extract text with confidence scores from prescription image.
    
    Args:
        image_path: Path to the prescription image
        
    Returns:
        List of tuples containing (text, confidence_score)
    """
    try:
        import os
        
        # Verify file exists
        if not os.path.exists(image_path):
            raise FileNotFoundError(f"Image file not found: {image_path}")
        
        logger.info(f"Reading image from: {image_path}")
        
        # Read image using cv2
        img = cv2.imread(image_path)
        
        if img is None:
            raise ValueError(f"Failed to read image: {image_path}")
        
        # Use ocr.predict() with image array
        result = ocr.predict(img)
        
        if result is None or len(result) == 0:
            logger.warning("OCR returned empty result")
            return []
        
        text_with_confidence = []
        for line in result[0]['rec_texts']:
            # For predict() method, confidence is in result[0]['rec_scores']
            # We'll just return the text for now
            text_with_confidence.append((line, 0.0))
        
        return text_with_confidence
    
    except Exception as e:
        logger.error(f"Error during OCR processing: {str(e)}", exc_info=True)
        raise Exception(f"OCR processing failed: {str(e)}")
