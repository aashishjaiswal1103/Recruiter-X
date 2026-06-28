import base64
import os
from cryptography.hazmat.primitives.kdf.hkdf import HKDF
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from services.supabase_client import get_supabase_client
from utils.errors import APIAuthError
from config import settings

class APIKeyManager:
    def __init__(self, master_secret: bytes = None):
        """
        Initializes the key manager.
        :param master_secret: The MASTER_ENCRYPTION_SECRET loaded from settings.
        """
        self.master_secret = master_secret or settings.MASTER_ENCRYPTION_SECRET

    def derive_org_key(self, org_id: str) -> bytes:
        """
        Derives a unique 32-byte key for the given org_id using HKDF.
        """
        hkdf = HKDF(
            algorithm=hashes.SHA256(),
            length=32,
            salt=None,
            info=org_id.encode('utf-8'),
        )
        return hkdf.derive(self.master_secret)

    def encrypt(self, plaintext_key: str, org_id: str) -> str:
        """
        Encrypts a key using AES-256-GCM.
        Prepend the 12-byte nonce to the ciphertext and base64-encode.
        """
        try:
            org_key = self.derive_org_key(org_id)
            aesgcm = AESGCM(org_key)
            
            # Generate random 12-byte nonce
            nonce = os.urandom(12)
            ciphertext = aesgcm.encrypt(nonce, plaintext_key.encode('utf-8'), None)
            
            # Prepend nonce to ciphertext and base64-encode
            combined = nonce + ciphertext
            return base64.b64encode(combined).decode('utf-8')
        except Exception as e:
            raise APIAuthError(f"Encryption of API key failed: {str(e)}")

    def decrypt(self, encrypted_blob_b64: str, org_id: str) -> str:
        """
        Decrypts a key base64 blob using AES-256-GCM.
        Extracts the first 12 bytes as the nonce and decrypts the remainder.
        """
        org_key = self.derive_org_key(org_id)
        aesgcm = AESGCM(org_key)
        
        try:
            combined = base64.b64decode(encrypted_blob_b64.encode('utf-8'))
            nonce = combined[:12]
            ciphertext = combined[12:]
            
            plaintext_bytes = aesgcm.decrypt(nonce, ciphertext, None)
            return plaintext_bytes.decode('utf-8')
        except Exception as e:
            raise APIAuthError(f"Decryption of API key failed: {str(e)}")

    def get_decrypted_key(self, api_key_id: str, org_id: str) -> str:
        """
        Queries the database for the key using api_key_id and org_id (enforced),
        decrypts, and returns the plaintext key.
        """
        supabase = get_supabase_client()
        response = supabase.table("api_keys") \
            .select("encrypted_key") \
            .eq("id", api_key_id) \
            .eq("org_id", org_id) \
            .execute()
            
        if not response.data or len(response.data) == 0:
            raise APIAuthError("API key not found or access denied.")
            
        encrypted_blob = response.data[0]["encrypted_key"]
        return self.decrypt(encrypted_blob, org_id)

    @staticmethod
    def mask_key(plaintext_key: str) -> str:
        """
        Returns a masked representation of the key for UI displays.
        Example: "•••••••••••••••••39f2"
        """
        if len(plaintext_key) <= 8:
            return "••••" + plaintext_key[-2:]
        return "••••••••••••••••" + plaintext_key[-4:]
