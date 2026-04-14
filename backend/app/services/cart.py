from decimal import Decimal
from uuid import UUID

from sqlalchemy.orm import Session

from app import models
from app.models.cart import Cart, CartItem
from app.models.product import Product, ProductSize
from app.schemas.cart import CartAddOn, CartItemCreate


class CartService:
    @staticmethod
    def _get_or_create_cart(db: Session, user_id: UUID) -> Cart:
        cart = db.query(Cart).filter(Cart.user_id == user_id).first()
        if cart:
            return cart

        cart = Cart(user_id=user_id)
        db.add(cart)
        db.flush()
        return cart

    @staticmethod
    def _calculate_unit_price(db: Session, product_id: int, size: str) -> Decimal:
        product = db.query(Product).filter(Product.id == product_id).first()
        if not product:
            return Decimal("0.00")

        base_price = product.base_price
        size_adjustment = (
            db.query(ProductSize)
            .filter(ProductSize.product_id == product_id, ProductSize.size_name == size)
            .first()
        )

        adjustment = size_adjustment.price_adjustment if size_adjustment else Decimal("0.00")
        return base_price + adjustment

    @staticmethod
    def _serialize_add_ons(add_ons: list[CartAddOn] | None) -> list[dict]:
        serialized_add_ons: list[dict] = []
        for add_on in add_ons or []:
            serialized_add_ons.append(
                {
                    "id": add_on.id,
                    "name": add_on.name,
                    "price": float(add_on.price),
                }
            )
        return serialized_add_ons

    @staticmethod
    def add_item(
        db: Session,
        user_id: UUID,
        item_data: CartItemCreate,
    ) -> CartItem:
        cart = CartService._get_or_create_cart(db, user_id)

        unit_price = CartService._calculate_unit_price(db, item_data.product_id, item_data.size)

        cart_item = CartItem(
            cart_id=cart.id,
            product_id=item_data.product_id,
            size=item_data.size,
            sweetness_level=item_data.sweetness_level,
            add_ons=CartService._serialize_add_ons(item_data.add_ons),
            quantity=item_data.quantity,
            unit_price=unit_price,
        )
        db.add(cart_item)
        db.commit()
        db.refresh(cart_item)
        return cart_item

    @staticmethod
    def get_cart(db: Session, user_id: UUID) -> Cart | None:
        return CartService._get_or_create_cart(db, user_id)

    @staticmethod
    def update_item_quantity(db: Session, user_id: UUID, item_id: int, quantity: int) -> CartItem | None:
        item = (
            db.query(CartItem)
            .join(Cart, CartItem.cart_id == Cart.id)
            .filter(Cart.user_id == user_id, CartItem.id == item_id)
            .first()
        )

        if not item:
            return None

        if quantity <= 0:
            db.delete(item)
        else:
            item.quantity = quantity

        db.commit()
        db.refresh(item) if item else None
        return item

    @staticmethod
    def remove_item(db: Session, user_id: UUID, item_id: int) -> bool:
        item = (
            db.query(CartItem)
            .join(Cart, CartItem.cart_id == Cart.id)
            .filter(Cart.user_id == user_id, CartItem.id == item_id)
            .first()
        )

        if not item:
            return False

        db.delete(item)
        db.commit()
        return True

    @staticmethod
    def clear_cart(db: Session, user_id: UUID) -> bool:
        cart = db.query(Cart).filter(Cart.user_id == user_id).first()
        if not cart:
            return False

        db.query(CartItem).filter(CartItem.cart_id == cart.id).delete()
        db.commit()
        return True
