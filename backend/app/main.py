from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.core.database import get_db, engine
from app import models

# Create all database tables automatically on startup
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="SkipLine API")

@app.get("/")
def health_check(db: Session = Depends(get_db)):
    try:
        # Try to execute a simple SQL ping
        db.execute(text("SELECT 1"))
        return {"status": "Backend is running and Database is connected!"}
    except Exception as e:
        return {"status": "Backend is running, but DB failed", "error": str(e)}