import os
from pydantic import BaseModel, Field
from dotenv import load_dotenv

# Load environment variables from .env if present
load_dotenv()

class Settings(BaseModel):
    ENVIRONMENT: str = Field(default_factory=lambda: os.getenv("ENVIRONMENT", "development"))
    
    # Supabase Configurations
    SUPABASE_URL: str = Field(default_factory=lambda: os.getenv("SUPABASE_URL", ""))
    SUPABASE_SERVICE_KEY: str = Field(default_factory=lambda: os.getenv("SUPABASE_SERVICE_KEY", ""))
    SUPABASE_JWT_SECRET: str = Field(default_factory=lambda: os.getenv("SUPABASE_JWT_SECRET", ""))
    DATABASE_URL: str = Field(default_factory=lambda: os.getenv("DATABASE_URL", ""))
    
    # Redis Cache and Queue Configurations
    REDIS_URL: str = Field(default_factory=lambda: os.getenv("REDIS_URL", "redis://localhost:6379"))
    
    # BYOK Key Encryption Master Secret
    MASTER_ENCRYPTION_SECRET: bytes = Field(
        default_factory=lambda: os.getenv("MASTER_ENCRYPTION_SECRET", "dummy_secret_for_development_purposes").encode("utf-8")
    )
    
    # Sentry Monitoring DSN
    SENTRY_DSN: str = Field(default_factory=lambda: os.getenv("SENTRY_DSN", ""))

settings = Settings()
