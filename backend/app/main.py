from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.core.database import get_db, engine, Base
from app import models
from app.api.routes import auth

# Create all database tables automatically on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(title="SkipLine API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register standard routers
app.include_router(auth.router, prefix="/api")

@app.get("/")
def health_check(db: Session = Depends(get_db)):
    try:
        # Try to execute a simple SQL ping
        db.execute(text("SELECT 1"))
        return {"status": "Backend is running and Database is connected!"}
    except Exception as e:
        return {"status": "Backend is running, but DB failed", "error": str(e)}