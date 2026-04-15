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


class OrderItemProductResponse(BaseModel):
    id: int
    name: str
    image_url: Optional[str] = None

    model_config = {"from_attributes": True}

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
    product: Optional[OrderItemProductResponse] = None
    model_config = {"from_attributes": True}

# Order
class OrderBase(BaseModel):
    guest_name: Optional[str] = None
    total_amount: Decimal
    payment_method: PaymentMethod

class OrderCreate(OrderBase):
    items: List[OrderItemCreate]


class OrderCreateFromCartRequest(BaseModel):
    payment_method: PaymentMethod
    guest_name: Optional[str] = None


class MarkOrderPaidRequest(BaseModel):
    payment_slip_url: Optional[str] = None


class OrderQueueEstimateResponse(BaseModel):
    orders_ahead: int
    prep_time_per_cup_minutes: int
    estimated_wait_minutes: int
    total_prep_seconds: int
    estimated_pickup_time: Optional[datetime] = None

class OrderResponse(OrderBase):
    id: UUID
    order_number: str
    customer_id: Optional[UUID] = None
    status: OrderStatus
    payment_slip_url: Optional[str] = None
    created_at: Optional[datetime] = None
    estimated_pickup_time: Optional[datetime] = None
    items: List[OrderItemResponse] = []
    
    model_config = {"from_attributes": True}
