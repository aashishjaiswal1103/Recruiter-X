# 04. API Key Manager & Cryptography

This document specifies the design and implementation details of the `APIKeyManager` class located in `services/api_key_manager.py`. It details the secure storage and decryption of third-party LLM credentials (BYOK).

---

## 1. Key Management Architecture

Recruiter-X allows clients to use their own LLM API keys (BYOK). To keep these keys safe:
1.  **Unique Derivation:** We use a Master Encryption Secret combined with the client's `org_id` using HKDF to derive a unique 256-bit encryption key per organization.
2.  **Symmetric Encryption:** Keys are encrypted using AES-256-GCM, generating a unique 12-byte initialization vector (nonce) for every encryption operation.
3.  **No Persistence of Plaintext:** Plaintext keys are decrypted just-in-time for API calls and are never stored in databases, caches, or logs.

---

## 2. APIKeyManager Implementation Details

The `APIKeyManager` should implement the following method signatures using the `cryptography` Python package.

### Code Blueprint
```python
# services/api_key_manager.py
import base64
import os
from cryptography.hazmat.primitives.kdf.hkdf import HKDF
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from services.supabase_client import get_supabase_client
from utils.errors import APIAuthError

class APIKeyManager:
    def __init__(self, master_secret: bytes):
        """
        Initializes the key manager.
        :param master_secret: The MASTER_ENCRYPTION_SECRET loaded from settings.
        """
        self.master_secret = master_secret

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
        org_key = self.derive_org_key(org_id)
        aesgcm = AESGCM(org_key)
        
        # Generate random 12-byte nonce
        nonce = os.urandom(12)
        ciphertext = aesgcm.encrypt(nonce, plaintext_key.encode('utf-8'), None)
        
        # Prepend nonce to ciphertext and base64-encode
        combined = nonce + ciphertext
        return base64.b64encode(combined).decode('utf-8')

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
```

---

## 3. Key Isolation & Lifecycle Security Policies

> [!IMPORTANT]
> The derived organization key uses HKDF info-binding. If a hacker manages to compromise one organization's derived key, they **cannot** decrypt keys from any other organization because the `org_id` is mixed into the key derivation function.

### Strict Coding Policies:
*   **No Logging:** Plaintext API keys must never be logged. You must ensure that key values are masked or omitted in exception messages, print statements, and logs.
*   **No Caching:** Plaintext keys should not be cached in memory (Redis, process memory, or local caches). They should be decrypted just-in-time for downstream client instantiation and discarded immediately after.
*   **No Response Leakage:** Never return the plaintext or encrypted key in API responses. The API router's response models must enforce schema serialization that excludes the `encrypted_key` field and returns only `mask_key` output.
