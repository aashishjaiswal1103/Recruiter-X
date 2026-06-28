import sys
import os
import psycopg2
from supabase import create_client

# Ensure the parent directory is in the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from config import settings

def run_migration():
    print("--- Recruiter-X Database Migration Tool ---")
    
    # 1. Direct PostgreSQL Schema Migration
    db_url = settings.DATABASE_URL
    if not db_url or db_url in ["", "your_supabase_postgres_connection_string"]:
        print("WARNING: DATABASE_URL not set in environment variables. Skipping SQL schema migration.")
        print("To migrate the database, configure DATABASE_URL in api/.env.")
    else:
        schema_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "database", "schema.sql")
        if not os.path.exists(schema_path):
            print(f"ERROR: schema.sql not found at {schema_path}")
            return
            
        print(f"Reading schema definition from {schema_path}...")
        with open(schema_path, "r") as f:
            sql_script = f.read()

        try:
            print("Connecting to PostgreSQL database...")
            conn = psycopg2.connect(db_url)
            conn.autocommit = True
            with conn.cursor() as cursor:
                print("Executing SQL schema script...")
                cursor.execute(sql_script)
            conn.close()
            print("SUCCESS: Database schema migration completed successfully.")
        except Exception as e:
            print(f"ERROR: Database schema migration failed. Details: {e}")

    # 2. Supabase Storage Bucket Provisioning
    sb_url = settings.SUPABASE_URL
    sb_key = settings.SUPABASE_SERVICE_KEY
    if not sb_url or not sb_key or sb_url in ["", "http://localhost:54321"] or sb_key in ["", "dummy_supabase_service_role_key"]:
        print("\nWARNING: Live Supabase client credentials are not configured. Skipping Storage Bucket setup.")
        print("To provision the storage bucket, configure SUPABASE_URL and SUPABASE_SERVICE_KEY in api/.env.")
    else:
        try:
            print("\nConnecting to Supabase Storage API...")
            supabase = create_client(sb_url, sb_key)
            
            # Check if bucket exists, or create it
            buckets = supabase.storage.list_buckets()
            exists = any(b.name == "resumes" for b in buckets)
            
            if exists:
                print("INFO: Storage bucket 'resumes' already exists.")
            else:
                print("Creating private storage bucket 'resumes'...")
                supabase.storage.create_bucket("resumes", options={"public": False})
                print("SUCCESS: Private storage bucket 'resumes' provisioned successfully.")
        except Exception as e:
            print(f"ERROR: Supabase Storage bucket provisioning failed. Details: {e}")

if __name__ == "__main__":
    run_migration()
