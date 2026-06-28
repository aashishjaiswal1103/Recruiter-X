from supabase import create_client, Client
from config import settings

_supabase_client: Client = None

def get_supabase_client() -> Client:
    """
    Initializes and returns a cached Supabase client using the service role key.
    This client bypasses RLS policies and is suitable for backend processing tasks.
    """
    global _supabase_client
    if _supabase_client is None:
        if not settings.SUPABASE_URL or not settings.SUPABASE_SERVICE_KEY:
            raise ValueError("SUPABASE_URL and SUPABASE_SERVICE_KEY must be configured in the environment variables.")
        _supabase_client = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_KEY)
    return _supabase_client
