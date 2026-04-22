"""
Groq API Client for Prescription Text Cleaning
"""
import json
import logging
import os
from groq import Groq

logger = logging.getLogger(__name__)


class GroqPrescriptionCleaner:
    """Client for cleaning prescription text using Groq API."""
    
    def __init__(self, api_key: str = None, model: str = "llama-3.3-70b-versatile"):
        """
        Initialize Groq client.
        
        Args:
            api_key: Groq API key (uses env variable if not provided)
            model: Model name to use (default: llama-3.3-70b-versatile)
        """
        self.api_key = api_key or os.getenv("GROQ_API_KEY")
        self.model = model
        
        if not self.api_key:
            raise ValueError("GROQ_API_KEY not found in environment variables")
        
        self.client = Groq(api_key=self.api_key)
    
    def clean_prescription_text(self, raw_ocr_text: str) -> dict:
        """
        Clean and structure prescription text using Groq LLM.
        
        Args:
            raw_ocr_text: Raw text extracted from OCR
            
        Returns:
            Dictionary containing cleaned prescription data
        """
        try:
            prompt = self._build_prompt(raw_ocr_text)
            
            message = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.3,
                max_tokens=1024
            )
            
            response_text = message.choices[0].message.content
            
            # Parse JSON response
            cleaned_data = self._parse_response(response_text)
            
            return cleaned_data
        
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse Groq response as JSON: {str(e)}")
            return {
                "error": "Failed to parse response",
                "raw_text": raw_ocr_text
            }
        except Exception as e:
            logger.error(f"Error calling Groq API: {str(e)}")
            raise Exception(f"Groq API error: {str(e)}")
    
    def _build_prompt(self, raw_ocr_text: str) -> str:
        """Build the prompt for Groq model focused on medicines only."""
        prompt = f"""You are a medical prescription analyzer. Your ONLY task is to extract medicine information from prescriptions.

IMPORTANT RULES:
- Extract ONLY medicines with their dosage and usage/timing
- Ignore patient names, doctor names, dates, phone numbers, and other non-medicine information
- Focus on: Medicine Name -> Dosage -> How to take (timing/schedule)
- Correct common spelling mistakes in medicine names
- Common medicine names: Paracetamol, Amoxicillin, Ibuprofen, Aspirin, Metformin, Atorvastatin, etc.

Input prescription text:
{raw_ocr_text}

Extract ALL medicines and return ONLY a valid JSON object (no markdown, no extra text):
{{
  "medicines": [
    {{
      "name": "Exact medicine name",
      "dosage": "dosage with unit (e.g., 500mg, 1ml, 2 tablets)",
      "schedule": "timing (e.g., 1-0-1, twice daily, morning/evening, as needed)"
    }}
  ],
  "notes": "Any special instructions or warnings specific to medicines"
}}

Important:
- medicines array should contain ALL medicines found
- If dosage is unclear, extract what's available
- If schedule/timing is unclear, extract what's available
- Return ONLY the JSON object, absolutely nothing else
- Do not include markdown backticks or code blocks"""
        
        return prompt
    
    def _parse_response(self, response_text: str) -> dict:
        """Parse and validate Groq response."""
        # Try to extract JSON from response (in case there's extra text)
        try:
            # First try direct parsing
            return json.loads(response_text)
        except json.JSONDecodeError:
            # Try to find JSON object in response
            import re
            json_match = re.search(r'\{[\s\S]*\}', response_text)
            if json_match:
                return json.loads(json_match.group())
            else:
                raise ValueError("No valid JSON found in response")


def clean_prescription(raw_ocr_text: str) -> dict:
    """
    Convenience function to clean prescription text.
    
    Args:
        raw_ocr_text: Raw text from OCR
        
    Returns:
        Cleaned prescription data as dictionary
    """
    cleaner = GroqPrescriptionCleaner()
    return cleaner.clean_prescription_text(raw_ocr_text)
