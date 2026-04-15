from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile
from sqlalchemy.orm import Session
from typing import List
import shutil
import os
import uuid
from app.core.database import get_db
from app.api.dependencies import get_current_user
from app.models.user import User, UserRole
from app.models.product import Product, Category, ProductSize, ProductAddOn
from app.models.store import StoreSettings
from app.schemas.product import ProductResponse, ProductCreate, ProductBase
from app.schemas.store import StoreSettingsResponse, StoreSettingsUpdate
from app.services.order import OrderService
from app.services.admin import AdminService

router = APIRouter(prefix="/admin", tags=["Admin"])

# Directory to store uploaded images
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Admin access verification moved to top to be available for all decorators
def check_admin_access(current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only administrators can access this resource"
        )
    return current_user

@router.post("/upload-image")
async def upload_image(
    file: UploadFile = File(...),
    admin: User = Depends(check_admin_access)
):
    """Upload an image and return the relative URL"""
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    # Generate unique filename
    file_extension = os.path.splitext(file.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return {"image_url": f"/uploads/{unique_filename}"}

# --- Menu & Inventory Management ---

@router.get("/products", response_model=List[ProductResponse])
def get_all_products(
    db: Session = Depends(get_db),
    admin: User = Depends(check_admin_access)
):
    """Get all products for inventory/menu management"""
    return AdminService.get_all_products(db)

@router.post("/products", response_model=ProductResponse)
def create_product(
    payload: ProductCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(check_admin_access)
):
    """Create a new menu item and inherit sizes/add-ons from category siblings"""
    return AdminService.create_product(db, payload)

@router.patch("/products/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: int,
    payload: dict, # Simplified update for flexibility
    db: Session = Depends(get_db),
    admin: User = Depends(check_admin_access)
):
    """Update product details (price, stock, availability, etc.)"""
    return AdminService.update_product(db, product_id, payload)

@router.delete("/products/{product_id}")
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(check_admin_access)
):
    """Delete a menu item"""
    return AdminService.delete_product(db, product_id)

# --- Store Settings ---

@router.get("/settings", response_model=StoreSettingsResponse)
def get_settings(
    db: Session = Depends(get_db),
    admin: User = Depends(check_admin_access)
):
    """Get global store settings (Busy Mode, etc.)"""
    return AdminService.get_settings(db)

@router.patch("/settings", response_model=StoreSettingsResponse)
def update_settings(
    payload: StoreSettingsUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(check_admin_access)
):
    """Update global store settings (Toggle Busy Mode)"""
    return AdminService.update_settings(db, payload.model_dump(exclude_unset=True))

# --- Performance Analytics ---

@router.get("/analytics/daily")
def get_daily_stats(
    db: Session = Depends(get_db),
    admin: User = Depends(check_admin_access)
):
    """Get performance metrics for today"""
    return AdminService.get_daily_stats(db)
