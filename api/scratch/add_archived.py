import psycopg2
import sys
import os

# Add parent path to import config
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from config import settings

def main():
    db_url = settings.DATABASE_URL
    if not db_url or db_url in ["", "your_supabase_postgres_connection_string"]:
        print("DATABASE_URL not set.")
        return
        
    try:
        conn = psycopg2.connect(db_url)
        conn.autocommit = True
        with conn.cursor() as cursor:
            cursor.execute("ALTER TYPE project_status ADD VALUE 'archived'")
            print("SUCCESS: Added 'archived' value to project_status enum.")
    except Exception as e:
        if "already exists" in str(e).lower() or "duplicate" in str(e).lower():
            print("INFO: 'archived' value already exists in project_status enum.")
        else:
            print(f"ERROR: {e}")
    finally:
        if 'conn' in locals() and conn:
            conn.close()

if __name__ == "__main__":
    main()
