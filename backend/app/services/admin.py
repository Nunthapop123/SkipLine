from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from app.models.product import Product, Category, ProductSize, ProductAddOn
from app.models.store import StoreSettings
from app.schemas.product import ProductResponse, ProductCreate
from fastapi import HTTPException


class AdminService:
    """Service layer for admin operations"""
    
    # --- Product Management ---
    
    @staticmethod
    def get_all_products(db: Session) -> List[Product]:
        """Get all products for inventory/menu management"""
        return db.query(Product).all()
    
    @staticmethod
    def get_product_by_id(db: Session, product_id: int) -> Optional[Product]:
        """Get a single product by ID"""
        return db.query(Product).filter(Product.id == product_id).first()
    
    @staticmethod
    def create_product(db: Session, payload: ProductCreate) -> Product:
        """Create a new menu item and inherit sizes/add-ons from category siblings"""
        product = Product(**payload.model_dump())
        db.add(product)
        db.flush()  # Get product.id without committing

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
    
    @staticmethod
    def update_product(db: Session, product_id: int, payload: Dict[str, Any]) -> Product:
        """Update product details (price, stock, availability, etc.)"""
        product = AdminService.get_product_by_id(db, product_id)
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        
        for key, value in payload.items():
            if hasattr(product, key):
                setattr(product, key, value)
        
        db.commit()
        db.refresh(product)
        return product
    
    @staticmethod
    def delete_product(db: Session, product_id: int) -> Dict[str, str]:
        """Delete a menu item"""
        product = AdminService.get_product_by_id(db, product_id)
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        
        db.delete(product)
        db.commit()
        return {"message": "Product deleted successfully"}
    
    # --- Store Settings Management ---
    
    @staticmethod
    def get_settings(db: Session) -> StoreSettings:
        """Get global store settings (Busy Mode, etc.)"""
        settings = db.query(StoreSettings).first()
        if not settings:
            settings = StoreSettings()
            db.add(settings)
            db.commit()
            db.refresh(settings)
        return settings
    
    @staticmethod
    def update_settings(db: Session, payload: Dict[str, Any]) -> StoreSettings:
        """Update global store settings (Toggle Busy Mode)"""
        settings = AdminService.get_settings(db)
        
        for key, value in payload.items():
            if hasattr(settings, key):
                setattr(settings, key, value)
        
        db.commit()
        db.refresh(settings)
        return settings
    
    # --- Analytics ---
    
    @staticmethod
    def get_daily_stats(db: Session) -> Dict[str, Any]:
        """Get performance metrics for today"""
        # This can be expanded with more analytics
        from app.services.order import OrderService
        return OrderService.get_daily_analytics(db)
