from decimal import Decimal
import re

from sqlalchemy.orm import Session

from app.models.product import Category, Product, ProductSize


class MenuService:
    @staticmethod
    def _slugify(name: str) -> str:
        slug = re.sub(r"[^a-z0-9]+", "-", name.strip().lower())
        return slug.strip("-")

    @staticmethod
    def _format_price(value: Decimal) -> str:
        return f"{Decimal(value):.2f}"

    @staticmethod
    def get_categories(db: Session) -> list[dict]:
        categories = db.query(Category).order_by(Category.id.asc()).all()

        results: list[dict] = []
        for category in categories:
            first_product = (
                db.query(Product)
                .filter(Product.category_id == category.id)
                .order_by(Product.id.asc())
                .first()
            )

            results.append(
                {
                    "id": category.id,
                    "name": category.name,
                    "slug": MenuService._slugify(category.name),
                    "image_url": first_product.image_url if first_product and first_product.image_url else "/hotCoffee.png",
                }
            )

        return results

    @staticmethod
    def get_products(db: Session, category_slug: str | None = None) -> list[dict]:
        products = db.query(Product).join(Category, Product.category_id == Category.id)

        if category_slug:
            category = (
                db.query(Category)
                .order_by(Category.id.asc())
                .all()
            )
            matched_category = next(
                (item for item in category if MenuService._slugify(item.name) == category_slug),
                None,
            )

            if matched_category is None:
                return []

            products = products.filter(Product.category_id == matched_category.id)

        product_list = products.order_by(Category.id.asc(), Product.id.asc()).all()

        results: list[dict] = []
        for product in product_list:
            sizes = (
                db.query(ProductSize)
                .filter(ProductSize.product_id == product.id)
                .order_by(ProductSize.id.asc())
                .all()
            )

            results.append(
                {
                    "id": product.id,
                    "name": product.name,
                    "description": product.description,
                    "base_price": MenuService._format_price(product.base_price),
                    "image_url": product.image_url,
                    "is_available": product.is_available,
                    "category": {
                        "id": product.category.id,
                        "name": product.category.name,
                        "slug": MenuService._slugify(product.category.name),
                    },
                    "sizes": [
                        {
                            "id": size.id,
                            "size_name": size.size_name,
                            "price_adjustment": MenuService._format_price(size.price_adjustment),
                        }
                        for size in sizes
                    ],
                }
            )

        return results
