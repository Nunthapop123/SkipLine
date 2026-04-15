import uuid
from datetime import datetime, timezone
import enum

from sqlalchemy import Column, Integer, String, Numeric, ForeignKey, Enum, DateTime
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship

from app.core.database import Base

class OrderStatus(str, enum.Enum):
    PENDING_PAYMENT = "PENDING_PAYMENT"
    CONFIRMED = "CONFIRMED"
    PREPARING = "PREPARING"
    READY = "READY"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"

class PaymentMethod(str, enum.Enum):
    CREDIT_CARD = "CREDIT_CARD"
    PROMPTPAY = "PROMPTPAY"
    CASH = "CASH"

class Order(Base):
    __tablename__ = "orders"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    order_number = Column(String, unique=True, index=True, nullable=False)
    customer_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    guest_name = Column(String, nullable=True)
    status = Column(Enum(OrderStatus), default=OrderStatus.PENDING_PAYMENT, nullable=False)
    total_amount = Column(Numeric(10, 2), nullable=False)
    payment_method = Column(Enum(PaymentMethod), nullable=False)
    payment_slip_url = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    estimated_pickup_time = Column(DateTime(timezone=True), nullable=True)

    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")
    customer = relationship("User", back_populates="orders")

class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(UUID(as_uuid=True), ForeignKey("orders.id"))
    product_id = Column(Integer, ForeignKey("products.id"))
    size = Column(String, nullable=False)
    sweetness_level = Column(Integer, nullable=False) # 0, 25, 50, 75, 100
    addons = Column(JSONB, nullable=True) # [{"name": "Mocha Sauce", "price": 2.00}]
    quantity = Column(Integer, nullable=False, default=1)
    item_subtotal = Column(Numeric(10, 2), nullable=False)

    order = relationship("Order", back_populates="items")
    product = relationship("Product", back_populates="order_items")
