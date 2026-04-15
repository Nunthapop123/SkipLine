from decimal import Decimal

from sqlalchemy.orm import Session

from app import models  # noqa: F401 - ensures model metadata is registered
from app.core.database import Base, SessionLocal, engine
from app.models.product import Category, Product, ProductSize


SIZE_ADJUSTMENTS = {
    "Small": Decimal("0.00"),
    "Medium": Decimal("0.75"),
    "Large": Decimal("1.50"),
}


MENU_SEED_DATA = [
    {
        "name": "Hot Coffee",
        "image": "/hotCoffee.png",
        "products": [
            {"name": "Espresso", "base_price": Decimal("2.95"), "description": "Rich and bold single-shot coffee."},
            {"name": "Americano", "base_price": Decimal("3.45"), "description": "Espresso diluted with hot water."},
            {"name": "Cappuccino", "base_price": Decimal("4.75"), "description": "Espresso with steamed milk and foam."},
            {"name": "Latte", "base_price": Decimal("4.95"), "description": "Smooth espresso with creamy milk."},
            {"name": "Mocha", "base_price": Decimal("5.25"), "description": "Chocolate and espresso blend."},
            {"name": "Flat White", "base_price": Decimal("5.15"), "description": "Velvety microfoam over espresso."},
        ],
    },
    {
        "name": "Ice Coffee",
        "image": "/iceCoffee.png",
        "products": [
            {"name": "Iced Espresso", "base_price": Decimal("3.45"), "description": "Strong espresso served chilled."},
            {"name": "Iced Americano", "base_price": Decimal("3.95"), "description": "Refreshing black iced coffee."},
            {"name": "Iced Cappuccino", "base_price": Decimal("5.05"), "description": "Foamy chilled cappuccino."},
            {"name": "Iced Latte", "base_price": Decimal("5.35"), "description": "Chilled milk and espresso blend."},
            {"name": "Iced Mocha", "base_price": Decimal("5.65"), "description": "Chocolate iced latte with espresso."},
            {"name": "Iced Caramel", "base_price": Decimal("5.75"), "description": "Caramel-infused iced coffee."},
        ],
    },
    {
        "name": "Tea & Matcha",
        "image": "/tea.png",
        "products": [
            {"name": "Hot Green Tea", "base_price": Decimal("3.25"), "description": "Classic fragrant green tea."},
            {"name": "Matcha Latte", "base_price": Decimal("5.45"), "description": "Premium matcha with milk."},
            {"name": "Iced Peach Tea", "base_price": Decimal("4.75"), "description": "Black tea with peach notes."},
            {"name": "Earl Grey", "base_price": Decimal("3.55"), "description": "Citrusy bergamot black tea."},
            {"name": "Chai Tea Latte", "base_price": Decimal("5.25"), "description": "Spiced tea with steamed milk."},
            {"name": "Iced Lemon Tea", "base_price": Decimal("4.35"), "description": "Bright and refreshing lemon tea."},
        ],
    },
    {
        "name": "Frappes & Blended",
        "image": "/frappes.png",
        "products": [
            {"name": "Mocha Frappe", "base_price": Decimal("5.95"), "description": "Blended chocolate mocha drink."},
            {"name": "Caramel Blend", "base_price": Decimal("6.15"), "description": "Creamy caramel blended beverage."},
            {"name": "Vanilla Bean", "base_price": Decimal("5.75"), "description": "Vanilla-forward creamy frappe."},
            {"name": "Chocolate Chip", "base_price": Decimal("6.25"), "description": "Chocolate chip blended drink."},
            {"name": "Java Chip", "base_price": Decimal("6.45"), "description": "Coffee frappe with java chips."},
            {"name": "Strawberry", "base_price": Decimal("5.85"), "description": "Fruity strawberry blended drink."},
        ],
    },
    {
        "name": "Non-Coffee & Refreshers",
        "image": "/nonCoffee.png",
        "products": [
            {"name": "Strawberry Refresher", "base_price": Decimal("4.95"), "description": "Sparkling strawberry refresher."},
            {"name": "Mango Dragonfruit", "base_price": Decimal("5.35"), "description": "Tropical mango dragonfruit drink."},
            {"name": "Classic Lemonade", "base_price": Decimal("4.25"), "description": "Fresh and tangy lemonade."},
            {"name": "Strawberry Lemonade", "base_price": Decimal("4.85"), "description": "Lemonade with strawberry twist."},
            {"name": "Very Berry", "base_price": Decimal("5.15"), "description": "Mixed berry refresher."},
            {"name": "Pink Drink", "base_price": Decimal("5.75"), "description": "Creamy fruit-forward signature drink."},
        ],
    },
]


def get_or_create_category(db: Session, category_name: str) -> tuple[Category, bool]:
    category = db.query(Category).filter(Category.name == category_name).first()
    if category:
        return category, False

    category = Category(name=category_name)
    db.add(category)
    db.flush()
    return category, True


def upsert_product(
    db: Session,
    category_id: int,
    product_name: str,
    description: str,
    base_price: Decimal,
    image_url: str,
) -> tuple[Product, bool]:
    product = (
        db.query(Product)
        .filter(Product.category_id == category_id, Product.name == product_name)
        .first()
    )

    if product:
        product.description = description
        product.base_price = base_price
        product.image_url = image_url
        product.is_available = True
        return product, False

    product = Product(
        category_id=category_id,
        name=product_name,
        description=description,
        base_price=base_price,
        image_url=image_url,
        is_available=True,
    )
    db.add(product)
    db.flush()
    return product, True


def reset_product_sizes(db: Session, product_id: int) -> None:
    db.query(ProductSize).filter(ProductSize.product_id == product_id).delete()

    for size_name, adjustment in SIZE_ADJUSTMENTS.items():
        db.add(
            ProductSize(
                product_id=product_id,
                size_name=size_name,
                price_adjustment=adjustment,
            )
        )


def seed_menu_data() -> None:
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    created_categories = 0
    created_products = 0
    updated_products = 0

    try:
        for category_data in MENU_SEED_DATA:
            category, was_created = get_or_create_category(db, category_data["name"])
            if was_created:
                created_categories += 1

            for product_data in category_data["products"]:
                product, was_created = upsert_product(
                    db=db,
                    category_id=category.id,
                    product_name=product_data["name"],
                    description=product_data["description"],
                    base_price=product_data["base_price"],
                    image_url=category_data["image"],
                )

                if was_created:
                    created_products += 1
                else:
                    updated_products += 1

                reset_product_sizes(db, product.id)

        db.commit()
        print("Menu seeding completed successfully.")
        print(f"Categories created: {created_categories}")
        print(f"Products created: {created_products}")
        print(f"Products updated: {updated_products}")
        print("Sizes reset for each product: Small(+$0.00), Medium(+$0.75), Large(+$1.50)")
    except Exception as exc:
        db.rollback()
        raise RuntimeError(f"Menu seeding failed: {exc}") from exc
    finally:
        db.close()


if __name__ == "__main__":
    seed_menu_data()
