from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.services.menu import MenuService
from app.models.store import StoreSettings
from app.schemas.store import StoreSettingsResponse

router = APIRouter(prefix="/menu", tags=["Menu"])


@router.get("/categories")
def list_categories(db: Session = Depends(get_db)):
    return MenuService.get_categories(db)


@router.get("/products")
def list_products(
    category: str | None = Query(default=None, description="Category slug, e.g. hot-coffee"),
    db: Session = Depends(get_db),
):
    return MenuService.get_products(db, category_slug=category)


@router.get("/products/{product_id}")
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = MenuService.get_product_by_id(db, product_id)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found",
        )

    return product


@router.get("/settings", response_model=StoreSettingsResponse)
def get_public_settings(db: Session = Depends(get_db)):
    """Get public store settings (Busy Mode status)"""
    settings = db.query(StoreSettings).first()
    if not settings:
        settings = StoreSettings()
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return settings
