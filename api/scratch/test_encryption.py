import sys
import os
import unittest

# Ensure parent directory is in the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.api_key_manager import APIKeyManager
from utils.errors import APIAuthError

class TestAPIKeyManager(unittest.TestCase):
    def setUp(self):
        self.master_secret = b"secure_master_key_32_bytes_long_!"
        self.km = APIKeyManager(self.master_secret)
        self.org_id = "org_test_123"

    def test_derive_key_length(self):
        derived = self.km.derive_org_key(self.org_id)
        self.assertEqual(len(derived), 32)

    def test_encrypt_decrypt_cycle(self):
        original_key = "gsk_gemini_test_api_key_xyz_123"
        encrypted = self.km.encrypt(original_key, self.org_id)
        
        # Verify decrypted matches original
        decrypted = self.km.decrypt(encrypted, self.org_id)
        self.assertEqual(decrypted, original_key)

    def test_decrypt_fail_with_different_org_id(self):
        original_key = "gsk_gemini_test_api_key_xyz_123"
        encrypted = self.km.encrypt(original_key, self.org_id)
        
        # Trying to decrypt with a different org_id must fail decryption due to GCM tag or derived key mismatch
        with self.assertRaises(APIAuthError):
            self.km.decrypt(encrypted, "different_org_456")

if __name__ == "__main__":
    unittest.main()
