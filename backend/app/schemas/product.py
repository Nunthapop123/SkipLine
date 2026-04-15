from pydantic import BaseModel
from typing import List, Optional
from decimal import Decimal

# Category
class CategoryBase(BaseModel):
    name: str

class CategoryResponse(CategoryBase):
    id: int
    model_config = {"from_attributes": True}

# Product Size
class ProductSizeBase(BaseModel):
    size_name: str
    price_adjustment: Decimal

class ProductSizeResponse(ProductSizeBase):
    id: int
    model_config = {"from_attributes": True}

# Product
class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    base_price: Decimal
    image_url: Optional[str] = None
    is_available: bool = True
    stock_quantity: int = 0
    category_id: int

class ProductCreate(ProductBase):
    pass

class ProductResponse(ProductBase):
    id: int
    category: CategoryResponse
    sizes: List[ProductSizeResponse] = []
    
    model_config = {"from_attributes": True}
