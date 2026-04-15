from __future__ import annotations

import random
from datetime import datetime, timedelta, timezone
from decimal import Decimal
from typing import Iterable
from uuid import UUID

from sqlalchemy.orm import Session, joinedload

from app.models.cart import Cart, CartItem
from app.models.order import Order, OrderItem, OrderStatus, PaymentMethod
from app.models.product import Product


class OrderService:
    BASE_PREP_SECONDS = 120
    FRAPPE_OR_BLENDED_MODIFIER_SECONDS = 60
    SLOW_BAR_OR_DRIP_MODIFIER_SECONDS = 150
    LARGE_SIZE_MODIFIER_SECONDS = 20
    VENTI_SIZE_MODIFIER_SECONDS = 30
    ADD_ON_MODIFIER_SECONDS = 15

    ACTIVE_QUEUE_STATUSES = (OrderStatus.CONFIRMED, OrderStatus.PREPARING)

    @staticmethod
    def _seconds_to_minutes_rounded_up(seconds: int) -> int:
        if seconds <= 0:
            return 0
        return (seconds + 59) // 60

    @staticmethod
    def _generate_order_number() -> str:
        timestamp = datetime.now(timezone.utc).strftime("%Y%m%d%H%M%S")
        suffix = random.randint(1000, 9999)
        return f"ORD-{timestamp}-{suffix}"

    @staticmethod
    def _to_decimal(value: object) -> Decimal:
        return Decimal(str(value))

    @classmethod
    def _calculate_item_subtotal(cls, cart_item: CartItem) -> Decimal:
        base_unit_price = cls._to_decimal(cart_item.unit_price)
        add_on_total = sum(cls._to_decimal(add_on.get("price", 0)) for add_on in (cart_item.add_ons or []))
        unit_total = base_unit_price + add_on_total
        subtotal = unit_total * max(1, cart_item.quantity)
        return subtotal.quantize(Decimal("0.01"))

    @staticmethod
    def _get_cart_with_items(db: Session, user_id: UUID) -> Cart | None:
        return (
            db.query(Cart)
            .options(
                joinedload(Cart.items)
                .joinedload(CartItem.product)
                .joinedload(Product.category)
            )
            .filter(Cart.user_id == user_id)
            .first()
        )

    @classmethod
    def _drink_type_modifier_seconds(cls, product_name: str | None, category_name: str | None) -> int:
        text = f"{product_name or ''} {category_name or ''}".lower()

        slow_bar_keywords = ("slow bar", "drip", "pour over", "v60", "syphon")
        frappe_keywords = ("frappe", "blended", "smoothie")

        if any(keyword in text for keyword in slow_bar_keywords):
            return cls.SLOW_BAR_OR_DRIP_MODIFIER_SECONDS

        if any(keyword in text for keyword in frappe_keywords):
            return cls.FRAPPE_OR_BLENDED_MODIFIER_SECONDS

        return 0

    @classmethod
    def _size_modifier_seconds(cls, size_name: str | None) -> int:
        size = (size_name or "").lower()
        if "venti" in size:
            return cls.VENTI_SIZE_MODIFIER_SECONDS
        if "large" in size or size.strip() == "l":
            return cls.LARGE_SIZE_MODIFIER_SECONDS
        return 0

    @classmethod
    def _addon_modifier_seconds(cls, add_on_count: int) -> int:
        return max(0, add_on_count) * cls.ADD_ON_MODIFIER_SECONDS

    @classmethod
    def _calculate_single_item_prep_seconds(
        cls,
        *,
        product_name: str | None,
        category_name: str | None,
        size_name: str | None,
        add_on_count: int,
    ) -> int:
        return (
            cls.BASE_PREP_SECONDS
            + cls._drink_type_modifier_seconds(product_name, category_name)
            + cls._size_modifier_seconds(size_name)
            + cls._addon_modifier_seconds(add_on_count)
        )

    @classmethod
    def _calculate_total_prep_seconds(cls, order_items: Iterable[OrderItem]) -> int:
        total_seconds = 0
        for order_item in order_items:
            product_name = order_item.product.name if order_item.product else None
            category_name = (
                order_item.product.category.name if order_item.product and order_item.product.category else None
            )
            add_on_count = len(order_item.addons or [])
            quantity = max(1, order_item.quantity)

            per_item_seconds = cls._calculate_single_item_prep_seconds(
                product_name=product_name,
                category_name=category_name,
                size_name=order_item.size,
                add_on_count=add_on_count,
            )
            total_seconds += per_item_seconds * quantity

        return total_seconds

    @classmethod
    def _find_active_queue_tail_time(cls, db: Session) -> datetime | None:
        last_active_order = (
            db.query(Order)
            .filter(Order.status.in_(cls.ACTIVE_QUEUE_STATUSES), Order.estimated_pickup_time.isnot(None))
            .order_by(Order.estimated_pickup_time.desc())
            .first()
        )

        return last_active_order.estimated_pickup_time if last_active_order else None

    @classmethod
    def _count_active_queue_orders(cls, db: Session) -> int:
        return (
            db.query(Order)
            .filter(Order.status.in_(cls.ACTIVE_QUEUE_STATUSES), Order.estimated_pickup_time.isnot(None))
            .count()
        )

    @classmethod
    def _estimate_pickup_time(cls, db: Session, total_prep_seconds: int) -> datetime:
        now = datetime.now(timezone.utc)
        queue_tail = cls._find_active_queue_tail_time(db)

        start_time = max(queue_tail, now) if queue_tail else now
        return start_time + timedelta(seconds=max(0, total_prep_seconds))

    @classmethod
    def estimate_from_cart(cls, db: Session, *, user_id: UUID) -> dict[str, object]:
        cart = cls._get_cart_with_items(db, user_id)
        if not cart or not cart.items:
            return {
                "orders_ahead": 0,
                "prep_time_per_cup_minutes": 0,
                "estimated_wait_minutes": 0,
                "total_prep_seconds": 0,
                "estimated_pickup_time": None,
            }

        order_like_items = [
            OrderItem(
                product=cart_item.product,
                size=cart_item.size,
                addons=cart_item.add_ons,
                quantity=cart_item.quantity,
            )
            for cart_item in cart.items
        ]

        total_qty = sum(max(1, item.quantity) for item in order_like_items)
        total_prep_seconds = cls._calculate_total_prep_seconds(order_like_items)
        prep_per_cup_seconds = total_prep_seconds // total_qty if total_qty > 0 else 0
        orders_ahead = cls._count_active_queue_orders(db)
        queue_tail = cls._find_active_queue_tail_time(db)

        now = datetime.now(timezone.utc)
        
        # If queue_tail is in the future, use actual time difference
        # If queue_tail is in the past (orders running late), fall back to orders_ahead estimation
        # This ensures we always account for the actual queue ahead
        if queue_tail and queue_tail > now:
            queue_wait_seconds = int((queue_tail - now).total_seconds())
        else:
            # Estimate based on orders ahead when queue is stalled or no active orders
            queue_wait_seconds = max(0, orders_ahead * prep_per_cup_seconds)
        
        estimated_wait_seconds = max(0, queue_wait_seconds + total_prep_seconds)
        estimated_pickup_time = now + timedelta(seconds=estimated_wait_seconds)

        return {
            "orders_ahead": orders_ahead,
            "prep_time_per_cup_minutes": cls._seconds_to_minutes_rounded_up(prep_per_cup_seconds),
            "estimated_wait_minutes": cls._seconds_to_minutes_rounded_up(estimated_wait_seconds),
            "total_prep_seconds": total_prep_seconds,
            "estimated_pickup_time": estimated_pickup_time,
        }

    @classmethod
    def create_order_from_cart(
        cls,
        db: Session,
        *,
        user_id: UUID,
        payment_method: PaymentMethod,
        guest_name: str | None = None,
    ) -> Order:
        cart = cls._get_cart_with_items(db, user_id)
        if not cart or not cart.items:
            raise ValueError("Cart is empty")

        order = Order(
            order_number=cls._generate_order_number(),
            customer_id=user_id,
            guest_name=guest_name,
            status=OrderStatus.PENDING_PAYMENT,
            total_amount=Decimal("0.00"),
            payment_method=payment_method,
        )
        db.add(order)

        total_amount = Decimal("0.00")
        for cart_item in cart.items:
            item_subtotal = cls._calculate_item_subtotal(cart_item)
            total_amount += item_subtotal

            order.items.append(
                OrderItem(
                    product_id=cart_item.product_id,
                    size=cart_item.size,
                    sweetness_level=cart_item.sweetness_level,
                    addons=cart_item.add_ons,
                    quantity=cart_item.quantity,
                    item_subtotal=item_subtotal,
                )
            )

        order.total_amount = total_amount.quantize(Decimal("0.01"))
        db.commit()
        db.refresh(order)
        return order

    @classmethod
    def mark_order_paid(
        cls,
        db: Session,
        *,
        order_id: UUID,
        user_id: UUID,
        payment_slip_url: str | None = None,
    ) -> Order | None:
        order = (
            db.query(Order)
            .options(
                joinedload(Order.items)
                .joinedload(OrderItem.product)
                .joinedload(Product.category)
            )
            .filter(Order.id == order_id, Order.customer_id == user_id)
            .first()
        )

        if not order:
            return None

        if order.status == OrderStatus.PENDING_PAYMENT:
            total_prep_seconds = cls._calculate_total_prep_seconds(order.items)
            order.estimated_pickup_time = cls._estimate_pickup_time(db, total_prep_seconds)
            order.status = OrderStatus.CONFIRMED

        if payment_slip_url:
            order.payment_slip_url = payment_slip_url

        cart = db.query(Cart).filter(Cart.user_id == user_id).first()
        if cart:
            db.query(CartItem).filter(CartItem.cart_id == cart.id).delete()

        db.commit()
        db.refresh(order)
        return order

    @staticmethod
    def get_order_by_id(db: Session, *, order_id: UUID, user_id: UUID) -> Order | None:
        return (
            db.query(Order)
            .options(joinedload(Order.items).joinedload(OrderItem.product))
            .filter(Order.id == order_id, Order.customer_id == user_id)
            .first()
        )

    @staticmethod
    def get_user_orders(db: Session, *, user_id: UUID) -> list[Order]:
        """Get all orders for a user, sorted by created_at descending"""
        return (
            db.query(Order)
            .options(joinedload(Order.items).joinedload(OrderItem.product))
            .filter(Order.customer_id == user_id)
            .order_by(Order.created_at.desc())
            .all()
        )
