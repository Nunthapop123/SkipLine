from pydantic import BaseModel
from typing import List, Optional, Any
from uuid import UUID
from decimal import Decimal
from datetime import datetime
from app.models.order import OrderStatus, PaymentMethod

# Addons
class AddonItem(BaseModel):
    name: str
    price: Decimal

# Order Item
class OrderItemBase(BaseModel):
    product_id: int
    size: str
    sweetness_level: int
    addons: Optional[List[AddonItem]] = None
    quantity: int = 1
    item_subtotal: Decimal

class OrderItemCreate(OrderItemBase):
    pass

class OrderItemResponse(OrderItemBase):
    id: int
    model_config = {"from_attributes": True}

# Order
class OrderBase(BaseModel):
    guest_name: Optional[str] = None
    total_amount: Decimal
    payment_method: PaymentMethod

class OrderCreate(OrderBase):
    items: List[OrderItemCreate]

class OrderResponse(OrderBase):
    id: UUID
    order_number: str
    customer_id: Optional[UUID] = None
    status: OrderStatus
    payment_slip_url: Optional[str] = None
    estimated_pickup_time: Optional[datetime] = None
    items: List[OrderItemResponse] = []
    
    model_config = {"from_attributes": True}
