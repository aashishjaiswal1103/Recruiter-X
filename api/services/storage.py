from services.supabase_client import get_supabase_client
from utils.errors import ExtractionError

def upload_file(file_bytes: bytes, bucket_name: str, file_path: str, content_type: str) -> str:
    """
    Uploads a file to a Supabase storage bucket and returns the file path.
    """
    try:
        supabase = get_supabase_client()
        # Upload options
        options = {"content-type": content_type, "cache-control": "3600"}
        # Upload file (upsert=True allows replacing files if they exist)
        supabase.storage.from_(bucket_name).upload(
            path=file_path,
            file=file_bytes,
            file_options=options
        )
        return file_path
    except Exception as e:
        raise ExtractionError(f"Failed to upload file to storage: {str(e)}")

def download_file(bucket_name: str, file_path: str) -> bytes:
    """
    Downloads file bytes from Supabase storage.
    """
    try:
        supabase = get_supabase_client()
        response_bytes = supabase.storage.from_(bucket_name).download(file_path)
        return response_bytes
    except Exception as e:
        raise ExtractionError(f"Failed to download file from storage: {str(e)}")

def generate_signed_url(bucket_name: str, file_path: str, expiry_seconds: int = 3600) -> str:
    """
    Generates a signed URL with a maximum lifetime of 1 hour.
    """
    try:
        supabase = get_supabase_client()
        response = supabase.storage.from_(bucket_name).create_signed_url(
            path=file_path,
            expires_in=expiry_seconds
        )
        # Handle variations of return dictionary structure
        return response.get("signedURL") or response.get("signedUrl") or ""
    except Exception as e:
        raise ExtractionError(f"Failed to generate signed URL: {str(e)}")
