from fastapi import FastAPI, Depends, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.core.database import get_db, engine, Base
from app import models
from app.api.routes import auth, menu, cart, order

# Create all database tables automatically on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(title="SkipLine API")

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    print(f"Validation Error: {exc.errors()}")
    return JSONResponse(
        status_code=422,
        content={"detail": exc.errors(), "body": exc.body},
    )

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
app.include_router(menu.router, prefix="/api")
app.include_router(cart.router, prefix="/api")
app.include_router(order.router, prefix="/api")

@app.get("/")
def health_check(db: Session = Depends(get_db)):
    try:
        # Try to execute a simple SQL ping
        db.execute(text("SELECT 1"))
        return {"status": "Backend is running and Database is connected!"}
    except Exception as e:
        return {"status": "Backend is running, but DB failed", "error": str(e)}