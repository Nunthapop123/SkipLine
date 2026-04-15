from decimal import Decimal
import re

from sqlalchemy.orm import Session

from app import models  # noqa: F401 - ensures model metadata is registered
from app.core.database import Base, SessionLocal, engine
from app.models.product import AddOn, Category, Product, ProductAddOn


ADD_ONS = [
    {"name": "Extra Espresso Shot", "category": "Condiment", "price": Decimal("1.00")},
    {"name": "Vanilla Syrup", "category": "Condiment", "price": Decimal("0.60")},
    {"name": "Caramel Syrup", "category": "Condiment", "price": Decimal("0.60")},
    {"name": "Hazelnut Syrup", "category": "Condiment", "price": Decimal("0.70")},
    {"name": "Mocha Sauce", "category": "Condiment", "price": Decimal("0.80")},
    {"name": "Chocolate Drizzle", "category": "Condiment", "price": Decimal("0.70")},
    {"name": "Whipped Cream", "category": "Topping", "price": Decimal("0.75")},
    {"name": "Sea Salt Cream", "category": "Topping", "price": Decimal("0.90")},
    {"name": "Boba Pearls", "category": "Topping", "price": Decimal("1.00")},
    {"name": "Grass Jelly", "category": "Topping", "price": Decimal("0.90")},
    {"name": "Aloe Vera", "category": "Topping", "price": Decimal("0.90")},
    {"name": "Egg Pudding", "category": "Topping", "price": Decimal("1.10")},
    {"name": "Lychee Jelly", "category": "Topping", "price": Decimal("1.00")},
    {"name": "Chia Seeds", "category": "Topping", "price": Decimal("0.80")},
    {"name": "Oat Milk", "category": "Milk Alternative", "price": Decimal("0.90")},
    {"name": "Soy Milk", "category": "Milk Alternative", "price": Decimal("0.80")},
]

CATEGORY_ADD_ON_MAP = {
    "hot-coffee": [
        "Extra Espresso Shot",
        "Vanilla Syrup",
        "Caramel Syrup",
        "Hazelnut Syrup",
        "Mocha Sauce",
        "Whipped Cream",
        "Chocolate Drizzle",
        "Oat Milk",
        "Soy Milk",
    ],
    "ice-coffee": [
        "Extra Espresso Shot",
        "Vanilla Syrup",
        "Caramel Syrup",
        "Hazelnut Syrup",
        "Mocha Sauce",
        "Whipped Cream",
        "Sea Salt Cream",
        "Chocolate Drizzle",
        "Oat Milk",
        "Soy Milk",
    ],
    "tea-matcha": [
        "Vanilla Syrup",
        "Caramel Syrup",
        "Whipped Cream",
        "Sea Salt Cream",
        "Boba Pearls",
        "Grass Jelly",
        "Aloe Vera",
        "Egg Pudding",
        "Lychee Jelly",
        "Oat Milk",
        "Soy Milk",
    ],
    "frappes-blended": [
        "Vanilla Syrup",
        "Caramel Syrup",
        "Mocha Sauce",
        "Whipped Cream",
        "Sea Salt Cream",
        "Chocolate Drizzle",
        "Chia Seeds",
        "Oat Milk",
        "Soy Milk",
    ],
    "non-coffee-refreshers": [
        "Vanilla Syrup",
        "Boba Pearls",
        "Grass Jelly",
        "Aloe Vera",
        "Lychee Jelly",
        "Chia Seeds",
    ],
}


def slugify(name: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", name.strip().lower()).strip("-")


def upsert_add_on(db: Session, name: str, category: str, price: Decimal) -> AddOn:
    add_on = db.query(AddOn).filter(AddOn.name == name).first()
    if add_on:
        add_on.category = category
        add_on.price_adjustment = price
        add_on.is_available = True
        return add_on

    add_on = AddOn(name=name, category=category, price_adjustment=price, is_available=True)
    db.add(add_on)
    db.flush()
    return add_on


def link_product_add_on(db: Session, product_id: int, add_on_id: int) -> None:
    existing = (
        db.query(ProductAddOn)
        .filter(ProductAddOn.product_id == product_id, ProductAddOn.add_on_id == add_on_id)
        .first()
    )
    if existing:
        return

    db.add(ProductAddOn(product_id=product_id, add_on_id=add_on_id))


def seed_add_ons() -> None:
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        add_on_map: dict[str, AddOn] = {}
        for item in ADD_ONS:
            add_on = upsert_add_on(db, item["name"], item["category"], item["price"])
            add_on_map[item["name"]] = add_on

        products = db.query(Product).join(Category, Product.category_id == Category.id).all()

        links_created = 0
        for product in products:
            category_slug = slugify(product.category.name)
            allowed_add_ons = CATEGORY_ADD_ON_MAP.get(category_slug, [])

            for add_on_name in allowed_add_ons:
                add_on = add_on_map.get(add_on_name)
                if not add_on:
                    continue

                before_count = (
                    db.query(ProductAddOn)
                    .filter(ProductAddOn.product_id == product.id, ProductAddOn.add_on_id == add_on.id)
                    .count()
                )
                link_product_add_on(db, product.id, add_on.id)
                after_count = (
                    db.query(ProductAddOn)
                    .filter(ProductAddOn.product_id == product.id, ProductAddOn.add_on_id == add_on.id)
                    .count()
                )
                if after_count > before_count:
                    links_created += 1

        db.commit()
        print("Add-on seeding completed successfully.")
        print(f"Add-ons available: {len(add_on_map)}")
        print(f"Product-add-on links created: {links_created}")
    except Exception as exc:
        db.rollback()
        raise RuntimeError(f"Add-on seeding failed: {exc}") from exc
    finally:
        db.close()


if __name__ == "__main__":
    seed_add_ons()
