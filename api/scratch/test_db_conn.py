import sys
import os

# Ensure the parent directory is in the Python path so we can import from config and services
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

try:
    from config import settings
    from services.supabase_client import get_supabase_client
    print("SUCCESS: Imported config and supabase_client successfully.")
except Exception as e:
    print(f"ERROR: Failed to import config or services. Details: {e}")
    sys.exit(1)

def test_settings():
    print("\n--- Testing App Settings Configuration ---")
    print(f"ENVIRONMENT: {settings.ENVIRONMENT}")
    print(f"SUPABASE_URL: {settings.SUPABASE_URL or 'MISSING'}")
    
    # Mask secrets
    def mask(secret: str) -> str:
        if not secret:
            return "MISSING"
        return secret[:6] + "..." if len(secret) > 6 else "PRESENT"
        
    print(f"SUPABASE_SERVICE_KEY: {mask(settings.SUPABASE_SERVICE_KEY)}")
    print(f"SUPABASE_JWT_SECRET: {mask(settings.SUPABASE_JWT_SECRET)}")
    print(f"REDIS_URL: {settings.REDIS_URL or 'MISSING'}")
    print(f"MASTER_ENCRYPTION_SECRET: {settings.MASTER_ENCRYPTION_SECRET[:10] if settings.MASTER_ENCRYPTION_SECRET else b''}...")

def test_supabase_connection():
    print("\n--- Testing Supabase Connection ---")
    if not settings.SUPABASE_URL or not settings.SUPABASE_SERVICE_KEY:
        print("WARNING: Skipping Supabase client validation since env parameters are missing.")
        return
        
    try:
        supabase = get_supabase_client()
        # Make a simple test call (e.g., query organisations table metadata)
        response = supabase.table("organisations").select("count", count="exact").limit(1).execute()
        print(f"SUCCESS: Connected to Supabase. Table query response: {response}")
    except Exception as e:
        print(f"ERROR: Connection to Supabase failed. Details: {e}")

if __name__ == "__main__":
    test_settings()
    test_supabase_connection()
