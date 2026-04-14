from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.services.menu import MenuService

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
