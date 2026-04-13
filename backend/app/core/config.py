import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    # Essential settings usually located in .env
    SECRET_KEY: str = os.getenv("SECRET_KEY", "super-secret-skip-line-key")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

settings = Settings()
