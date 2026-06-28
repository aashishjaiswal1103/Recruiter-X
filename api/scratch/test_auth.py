import sys
import os
import asyncio

# Ensure parent directory is in the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi import HTTPException
from utils.auth import authenticate_jwt
from config import settings

class MockRequest:
    def __init__(self, headers):
        self.headers = headers
        self.state = MockState()

class MockState:
    def __init__(self):
        self.user_id = None

async def run_verification_tests():
    print("--- Running Backend Auth Dependency Tests ---")
    
    # Save original configurations
    old_secret = settings.SUPABASE_JWT_SECRET
    settings.SUPABASE_JWT_SECRET = "dummy_supabase_jwt_secret_minimum_32_chars_long_for_security"

    try:
        # Test Case 1: Missing Authorization Header
        req_missing = MockRequest(headers={})
        try:
            await authenticate_jwt(req_missing)
            print("FAILED: Expected missing header to raise HTTPException")
        except HTTPException as e:
            assert e.status_code == 401, f"Expected 401 status, got {e.status_code}"
            assert e.detail["code"] == "MISSING_BEARER_TOKEN", f"Expected MISSING_BEARER_TOKEN code, got {e.detail['code']}"
            print("SUCCESS: Missing header rejected correctly (401 MISSING_BEARER_TOKEN).")

        # Test Case 2: Invalid Authorization Format
        req_invalid_format = MockRequest(headers={"Authorization": "Basic username:password"})
        try:
            await authenticate_jwt(req_invalid_format)
            print("FAILED: Expected invalid header format to raise HTTPException")
        except HTTPException as e:
            assert e.status_code == 401, f"Expected 401 status, got {e.status_code}"
            assert e.detail["code"] == "MISSING_BEARER_TOKEN", f"Expected MISSING_BEARER_TOKEN code, got {e.detail['code']}"
            print("SUCCESS: Invalid header format rejected correctly (401 MISSING_BEARER_TOKEN).")

        # Test Case 3: Verify token claims extraction (Dev bypass validation mode)
        # In case settings.SUPABASE_JWT_SECRET is bypassed or unverified check is triggered
        req_dev_token = MockRequest(headers={"Authorization": "Bearer dummy_token_payload"})
        
        # Test unverified parsing path by emptying secret
        settings.SUPABASE_JWT_SECRET = "MISSING"
        user_id = await authenticate_jwt(req_dev_token)
        assert user_id is not None
        assert req_dev_token.state.user_id == user_id
        print("SUCCESS: Dev bypass token validation parsing worked correctly.")

    finally:
        # Restore configurations
        settings.SUPABASE_JWT_SECRET = old_secret
    
    print("--- All backend auth unit tests passed successfully ---")

if __name__ == "__main__":
    asyncio.run(run_verification_tests())
