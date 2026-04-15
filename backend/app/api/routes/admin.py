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
    return db.query(Product).all()

@router.post("/products", response_model=ProductResponse)
def create_product(
    payload: ProductCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(check_admin_access)
):
    """Create a new menu item and inherit sizes/add-ons from category siblings"""
    product = Product(**payload.model_dump())
    db.add(product)
    db.flush() # Get product.id without committing

    # Find a sibling product in the same category to use as a template
    sibling = db.query(Product).filter(
        Product.category_id == product.category_id,
        Product.id != product.id
    ).first()

    if sibling:
        # Copy sizes
        for size in sibling.sizes:
            new_size = ProductSize(
                product_id=product.id,
                size_name=size.size_name,
                price_adjustment=size.price_adjustment
            )
            db.add(new_size)
        
        # Copy add-ons
        for pa in sibling.product_add_ons:
            new_pa = ProductAddOn(
                product_id=product.id,
                add_on_id=pa.add_on_id
            )
            db.add(new_pa)

    db.commit()
    db.refresh(product)
    return product

@router.patch("/products/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: int,
    payload: dict, # Simplified update for flexibility
    db: Session = Depends(get_db),
    admin: User = Depends(check_admin_access)
):
    """Update product details (price, stock, availability, etc.)"""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    for key, value in payload.items():
        if hasattr(product, key):
            setattr(product, key, value)
    
    db.commit()
    db.refresh(product)
    return product

@router.delete("/products/{product_id}")
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(check_admin_access)
):
    """Delete a menu item"""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    db.delete(product)
    db.commit()
    return {"message": "Product deleted successfully"}

# --- Store Settings ---

@router.get("/settings", response_model=StoreSettingsResponse)
def get_settings(
    db: Session = Depends(get_db),
    admin: User = Depends(check_admin_access)
):
    """Get global store settings (Busy Mode, etc.)"""
    settings = db.query(StoreSettings).first()
    if not settings:
        settings = StoreSettings() # Should ideally be seeded
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return settings

@router.patch("/settings", response_model=StoreSettingsResponse)
def update_settings(
    payload: StoreSettingsUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(check_admin_access)
):
    """Update global store settings (Toggle Busy Mode)"""
    settings = db.query(StoreSettings).first()
    if not settings:
        raise HTTPException(status_code=404, detail="Settings not found")
    
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(settings, key, value)
    
    db.commit()
    db.refresh(settings)
    return settings

# --- Performance Analytics ---

@router.get("/analytics/daily")
def get_daily_stats(
    db: Session = Depends(get_db),
    admin: User = Depends(check_admin_access)
):
    """Get performance metrics for today"""
    return OrderService.get_daily_analytics(db)
