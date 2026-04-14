from pydantic import BaseModel
from pydantic import Field
from typing import List, Optional
from decimal import Decimal
from uuid import UUID
from datetime import datetime

# AddOn in cart context
class CartAddOn(BaseModel):
    id: int
    name: str
    price: float


class CartProduct(BaseModel):
    id: int
    name: str
    image_url: Optional[str] = None

    model_config = {"from_attributes": True}


# Cart Item
class CartItemBase(BaseModel):
    product_id: int
    size: str
    sweetness_level: int
    add_ons: Optional[List[CartAddOn]] = Field(default=None, alias="addOns")
    quantity: int = 1
    unit_price: Decimal

    model_config = {"populate_by_name": True}


class CartItemCreate(BaseModel):
    product_id: int
    size: str
    sweetness_level: int
    add_ons: Optional[List[CartAddOn]] = Field(default=None, alias="addOns")
    quantity: int = 1

    model_config = {"populate_by_name": True}


class CartItemResponse(CartItemBase):
    id: int
    created_at: datetime
    product: Optional[CartProduct] = None

    model_config = {"from_attributes": True}


# Cart
class CartResponse(BaseModel):
    id: UUID
    items: List[CartItemResponse] = []
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
