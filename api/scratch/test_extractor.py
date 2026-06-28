import sys
import os
import unittest
from io import BytesIO

# Ensure parent directory is in the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.resume_extractor import validate_file, is_likely_scanned
from utils.errors import ExtractionError

class TestResumeExtractor(unittest.TestCase):
    def test_validate_file_size_exceeded(self):
        # 11MB dummy content
        large_content = b"a" * (11 * 1024 * 1024)
        with self.assertRaises(ExtractionError) as context:
            validate_file(large_content, "application/pdf")
        self.assertIn("exceeds the 10MB limit", str(context.exception))

    def test_validate_unsupported_mime(self):
        content = b"dummy content"
        with self.assertRaises(ExtractionError) as context:
            validate_file(content, "image/png")
        self.assertIn("Unsupported file format", str(context.exception))

    def test_is_likely_scanned_trigger(self):
        # Sparse text
        scanned_text = "   John Doe   "
        self.assertTrue(is_likely_scanned(scanned_text))
        
        # Dense text
        dense_text = "a" * 150
        self.assertFalse(is_likely_scanned(dense_text))

if __name__ == "__main__":
    unittest.main()
